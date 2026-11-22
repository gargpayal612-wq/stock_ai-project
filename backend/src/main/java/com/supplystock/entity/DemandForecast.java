package com.supplystock.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "demand_forecasts")
public class DemandForecast {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "forecast_date", nullable = false)
    private LocalDate forecastDate = LocalDate.now();

    @Column(name = "forecast_period_days", nullable = false)
    private Integer forecastPeriodDays = 30;

    @Column(name = "baseline_predicted_demand", nullable = false)
    private Integer baselinePredictedDemand;

    @Column(name = "ml_predicted_demand", nullable = false)
    private Integer mlPredictedDemand;

    @Column(name = "confidence_lower")
    private Integer confidenceLower;

    @Column(name = "confidence_upper")
    private Integer confidenceUpper;

    @Column(name = "recommended_reorder_qty", nullable = false)
    private Integer recommendedReorderQty = 0;

    @Column(name = "safety_stock_calculated", nullable = false)
    private Integer safetyStockCalculated = 0;

    @Column(name = "model_name", nullable = false, length = 80)
    private String modelName = "RandomForestRegressor";

    @Column(name = "model_version", length = 40)
    private String modelVersion = "v1.0.0";

    @Column(name = "actual_sales")
    private Integer actualSales;

    @Column(name = "is_demo", nullable = false)
    private Boolean isDemo = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public DemandForecast() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

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

    public String getModelName() { return modelName; }
    public void setModelName(String modelName) { this.modelName = modelName; }

    public String getModelVersion() { return modelVersion; }
    public void setModelVersion(String modelVersion) { this.modelVersion = modelVersion; }

    public Integer getActualSales() { return actualSales; }
    public void setActualSales(Integer actualSales) { this.actualSales = actualSales; }

    public Boolean getIsDemo() { return isDemo; }
    public void setIsDemo(Boolean isDemo) { this.isDemo = isDemo; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
