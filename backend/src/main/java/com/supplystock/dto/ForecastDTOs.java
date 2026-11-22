package com.supplystock.dto;

import java.time.LocalDate;

public class ForecastDTOs {

    public static class ForecastRequestDTO {
        private Long productId;
        private Integer horizonDays = 30;

        public ForecastRequestDTO() {}

        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }
        public Integer getHorizonDays() { return horizonDays; }
        public void setHorizonDays(Integer horizonDays) { this.horizonDays = horizonDays; }
    }

    public static class ForecastResponseDTO {
        private Long id;
        private Long productId;
        private String productName;
        private String sku;
        private LocalDate forecastDate;
        private Integer forecastPeriodDays;
        private Integer baselinePredictedDemand;
        private Integer mlPredictedDemand;
        private Integer confidenceLower;
        private Integer confidenceUpper;
        private Integer recommendedReorderQty;
        private Integer safetyStockCalculated;
        private Integer availableStock;
        private Integer incomingStock;
        private String modelName;
        private String modelVersion;
        private Boolean isDemo;
        private String explanation;

        public ForecastResponseDTO() {}

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }
        public String getProductName() { return productName; }
        public void setProductName(String productName) { this.productName = productName; }
        public String getSku() { return sku; }
        public void setSku(String sku) { this.sku = sku; }
        public LocalDate getForecastDate() { return forecastDate; }
        public void setForecastDate(LocalDate forecastDate) { this.forecastDate = forecastDate; }
        public Integer getForecastPeriodDays() { return forecastPeriodDays; }
        public void setForecastPeriodDays(Integer forecastPeriodDays) { this.forecastPeriodDays = forecastPeriodDays; }
        public Integer getBaselinePredictedDemand() { return baselinePredictedDemand; }
        public void setBaselinePredictedDemand(Integer baselinePredictedDemand) { this.baselinePredictedDemand = baselinePredictedDemand; }
        public Integer getMlPredictedDemand() { return mlPredictedDemand; }
        public void setMlPredictedDemand(Integer mlPredictedDemand) { this.mlPredictedDemand = mlPredictedDemand; }
        public Integer getConfidenceLower() { return confidenceLower; }
        public void setConfidenceLower(Integer confidenceLower) { this.confidenceLower = confidenceLower; }
        public Integer getConfidenceUpper() { return confidenceUpper; }
        public void setConfidenceUpper(Integer confidenceUpper) { this.confidenceUpper = confidenceUpper; }
        public Integer getRecommendedReorderQty() { return recommendedReorderQty; }
        public void setRecommendedReorderQty(Integer recommendedReorderQty) { this.recommendedReorderQty = recommendedReorderQty; }
        public Integer getSafetyStockCalculated() { return safetyStockCalculated; }
        public void setSafetyStockCalculated(Integer safetyStockCalculated) { this.safetyStockCalculated = safetyStockCalculated; }
        public Integer getAvailableStock() { return availableStock; }
        public void setAvailableStock(Integer availableStock) { this.availableStock = availableStock; }
        public Integer getIncomingStock() { return incomingStock; }
        public void setIncomingStock(Integer incomingStock) { this.incomingStock = incomingStock; }
        public String getModelName() { return modelName; }
        public void setModelName(String modelName) { this.modelName = modelName; }
        public String getModelVersion() { return modelVersion; }
        public void setModelVersion(String modelVersion) { this.modelVersion = modelVersion; }
        public Boolean getIsDemo() { return isDemo; }
        public void setIsDemo(Boolean isDemo) { this.isDemo = isDemo; }
        public String getExplanation() { return explanation; }
        public void setExplanation(String explanation) { this.explanation = explanation; }
    }
}
