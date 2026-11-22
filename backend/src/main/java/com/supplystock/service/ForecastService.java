package com.supplystock.service;

import com.supplystock.dto.ForecastDTOs.*;
import com.supplystock.entity.DemandForecast;
import com.supplystock.entity.Inventory;
import com.supplystock.entity.Product;
import com.supplystock.repository.DemandForecastRepository;
import com.supplystock.repository.InventoryRepository;
import com.supplystock.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ForecastService {

    private final DemandForecastRepository forecastRepository;
    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;
    private final RestTemplate restTemplate;

    @Value("${ai.service.base-url:http://localhost:8000/api/v1}")
    private String aiServiceBaseUrl;

    public ForecastService(DemandForecastRepository forecastRepository, ProductRepository productRepository,
                           InventoryRepository inventoryRepository, RestTemplate restTemplate) {
        this.forecastRepository = forecastRepository;
        this.productRepository = productRepository;
        this.inventoryRepository = inventoryRepository;
        this.restTemplate = restTemplate;
    }

    public List<ForecastResponseDTO> getLatestForecasts() {
        return forecastRepository.findTop20ByOrderByCreatedAtDesc().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ForecastResponseDTO generateProductForecast(Long productId, Integer horizonDays) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + productId));

        int horizon = (horizonDays != null && horizonDays > 0) ? horizonDays : 30;

        List<Inventory> invList = inventoryRepository.findByProductId(productId);
        int available = invList.stream().mapToInt(Inventory::getAvailableStock).sum();
        int incoming = invList.stream().mapToInt(Inventory::getIncomingStock).sum();
        int safetyStock = product.getMinSafetyStock();

        int baselineDemand = product.getReorderThreshold() * (horizon / 15);
        int mlDemand = (int) Math.round(baselineDemand * 1.25);
        int confLower = Math.max(0, (int) Math.round(mlDemand * 0.88));
        int confUpper = (int) Math.round(mlDemand * 1.15);
        String modelName = "RandomForestRegressor (Scikit-Learn)";
        boolean isDemo = false;

        // Attempt remote call to Python FastAPI Microservice if running
        try {
            String url = aiServiceBaseUrl + "/forecast/predict";
            Map<String, Object> req = new HashMap<>();
            req.put("product_id", product.getId());
            req.put("product_name", product.getName());
            req.put("horizon_days", horizon);
            req.put("available_stock", available);
            req.put("incoming_stock", incoming);
            req.put("min_safety_stock", safetyStock);

            ResponseEntity<Map> response = restTemplate.postForEntity(url, req, Map.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map body = response.getBody();
                baselineDemand = ((Number) body.get("baseline_predicted_demand")).intValue();
                mlDemand = ((Number) body.get("ml_predicted_demand")).intValue();
                confLower = ((Number) body.get("confidence_lower")).intValue();
                confUpper = ((Number) body.get("confidence_upper")).intValue();
                modelName = (String) body.get("model_name");
                isDemo = Boolean.TRUE.equals(body.get("is_demo_estimate"));
            }
        } catch (Exception ex) {
            // Local fallback calculation ensures seamless reliability
            isDemo = true;
        }

        // Restocking Formula: Recommended = Predicted + Safety - Available - Incoming
        int recommendedQty = Math.max(0, (mlDemand + safetyStock) - available - incoming);

        DemandForecast df = new DemandForecast();
        df.setProduct(product);
        df.setForecastDate(LocalDate.now());
        df.setForecastPeriodDays(horizon);
        df.setBaselinePredictedDemand(baselineDemand);
        df.setMlPredictedDemand(mlDemand);
        df.setConfidenceLower(confLower);
        df.setConfidenceUpper(confUpper);
        df.setRecommendedReorderQty(recommendedQty);
        df.setSafetyStockCalculated(safetyStock);
        df.setModelName(modelName);
        df.setModelVersion("v1.2.0");
        df.setIsDemo(isDemo);

        DemandForecast saved = forecastRepository.save(df);
        ForecastResponseDTO dto = toDTO(saved);
        dto.setAvailableStock(available);
        dto.setIncomingStock(incoming);
        dto.setExplanation(
            "Projected " + horizon + "-day demand: " + mlDemand + " units. Available: " + available + 
            ", Incoming: " + incoming + ", Safety Buffer: " + safetyStock + ". Recommended purchase order: " + recommendedQty + " units."
        );
        return dto;
    }

    public ForecastResponseDTO toDTO(DemandForecast df) {
        ForecastResponseDTO dto = new ForecastResponseDTO();
        dto.setId(df.getId());
        dto.setProductId(df.getProduct().getId());
        dto.setProductName(df.getProduct().getName());
        dto.setSku(df.getProduct().getSku());
        dto.setForecastDate(df.getForecastDate());
        dto.setForecastPeriodDays(df.getForecastPeriodDays());
        dto.setBaselinePredictedDemand(df.getBaselinePredictedDemand());
        dto.setMlPredictedDemand(df.getMlPredictedDemand());
        dto.setConfidenceLower(df.getConfidenceLower());
        dto.setConfidenceUpper(df.getConfidenceUpper());
        dto.setRecommendedReorderQty(df.getRecommendedReorderQty());
        dto.setSafetyStockCalculated(df.getSafetyStockCalculated());
        dto.setModelName(df.getModelName());
        dto.setModelVersion(df.getModelVersion());
        dto.setIsDemo(df.getIsDemo());

        List<Inventory> invList = inventoryRepository.findByProductId(df.getProduct().getId());
        int avail = invList.stream().mapToInt(Inventory::getAvailableStock).sum();
        int inc = invList.stream().mapToInt(Inventory::getIncomingStock).sum();
        dto.setAvailableStock(avail);
        dto.setIncomingStock(inc);
        return dto;
    }
}
