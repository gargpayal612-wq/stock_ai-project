package com.supplystock.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ProductDTO {
    private Long id;
    private String name;
    private String sku;
    private Long categoryId;
    private String categoryName;
    private String description;
    private BigDecimal costPrice;
    private BigDecimal sellingPrice;
    private String unit;
    private Integer reorderThreshold;
    private Integer minSafetyStock;
    private Integer leadTimeDays;
    private Boolean isActive;
    private Integer totalAvailableStock;
    private Integer totalIncomingStock;
    private String stockStatus; // HEALTHY, LOW_STOCK, OUT_OF_STOCK
    private LocalDateTime createdAt;

    public ProductDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BigDecimal getCostPrice() { return costPrice; }
    public void setCostPrice(BigDecimal costPrice) { this.costPrice = costPrice; }
    public BigDecimal getSellingPrice() { return sellingPrice; }
    public void setSellingPrice(BigDecimal sellingPrice) { this.sellingPrice = sellingPrice; }
    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }
    public Integer getReorderThreshold() { return reorderThreshold; }
    public void setReorderThreshold(Integer reorderThreshold) { this.reorderThreshold = reorderThreshold; }
    public Integer getMinSafetyStock() { return minSafetyStock; }
    public void setMinSafetyStock(Integer minSafetyStock) { this.minSafetyStock = minSafetyStock; }
    public Integer getLeadTimeDays() { return leadTimeDays; }
    public void setLeadTimeDays(Integer leadTimeDays) { this.leadTimeDays = leadTimeDays; }
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    public Integer getTotalAvailableStock() { return totalAvailableStock; }
    public void setTotalAvailableStock(Integer totalAvailableStock) { this.totalAvailableStock = totalAvailableStock; }
    public Integer getTotalIncomingStock() { return totalIncomingStock; }
    public void setTotalIncomingStock(Integer totalIncomingStock) { this.totalIncomingStock = totalIncomingStock; }
    public String getStockStatus() { return stockStatus; }
    public void setStockStatus(String stockStatus) { this.stockStatus = stockStatus; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
