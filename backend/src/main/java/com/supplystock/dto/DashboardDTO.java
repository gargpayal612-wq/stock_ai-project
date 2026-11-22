package com.supplystock.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class DashboardDTO {
    private Long totalProducts;
    private Long totalSuppliers;
    private BigDecimal totalInventoryCostValue;
    private BigDecimal totalInventoryRetailValue;
    private Long lowStockCount;
    private Long outOfStockCount;
    private Long pendingPurchaseOrders;
    private Long activeShipments;
    private Long delayedShipments;
    private BigDecimal totalSalesRevenue;
    private List<Map<String, Object>> recentSalesTrend;
    private List<Map<String, Object>> categoryStockDistribution;
    private List<ProductDTO> topLowStockProducts;
    private List<SupplierDTO> topSuppliers;

    public DashboardDTO() {}

    public Long getTotalProducts() { return totalProducts; }
    public void setTotalProducts(Long totalProducts) { this.totalProducts = totalProducts; }
    public Long getTotalSuppliers() { return totalSuppliers; }
    public void setTotalSuppliers(Long totalSuppliers) { this.totalSuppliers = totalSuppliers; }
    public BigDecimal getTotalInventoryCostValue() { return totalInventoryCostValue; }
    public void setTotalInventoryCostValue(BigDecimal totalInventoryCostValue) { this.totalInventoryCostValue = totalInventoryCostValue; }
    public BigDecimal getTotalInventoryRetailValue() { return totalInventoryRetailValue; }
    public void setTotalInventoryRetailValue(BigDecimal totalInventoryRetailValue) { this.totalInventoryRetailValue = totalInventoryRetailValue; }
    public Long getLowStockCount() { return lowStockCount; }
    public void setLowStockCount(Long lowStockCount) { this.lowStockCount = lowStockCount; }
    public Long getOutOfStockCount() { return outOfStockCount; }
    public void setOutOfStockCount(Long outOfStockCount) { this.outOfStockCount = outOfStockCount; }
    public Long getPendingPurchaseOrders() { return pendingPurchaseOrders; }
    public void setPendingPurchaseOrders(Long pendingPurchaseOrders) { this.pendingPurchaseOrders = pendingPurchaseOrders; }
    public Long getActiveShipments() { return activeShipments; }
    public void setActiveShipments(Long activeShipments) { this.activeShipments = activeShipments; }
    public Long getDelayedShipments() { return delayedShipments; }
    public void setDelayedShipments(Long delayedShipments) { this.delayedShipments = delayedShipments; }
    public BigDecimal getTotalSalesRevenue() { return totalSalesRevenue; }
    public void setTotalSalesRevenue(BigDecimal totalSalesRevenue) { this.totalSalesRevenue = totalSalesRevenue; }
    public List<Map<String, Object>> getRecentSalesTrend() { return recentSalesTrend; }
    public void setRecentSalesTrend(List<Map<String, Object>> recentSalesTrend) { this.recentSalesTrend = recentSalesTrend; }
    public List<Map<String, Object>> getCategoryStockDistribution() { return categoryStockDistribution; }
    public void setCategoryStockDistribution(List<Map<String, Object>> categoryStockDistribution) { this.categoryStockDistribution = categoryStockDistribution; }
    public List<ProductDTO> getTopLowStockProducts() { return topLowStockProducts; }
    public void setTopLowStockProducts(List<ProductDTO> topLowStockProducts) { this.topLowStockProducts = topLowStockProducts; }
    public List<SupplierDTO> getTopSuppliers() { return topSuppliers; }
    public void setTopSuppliers(List<SupplierDTO> topSuppliers) { this.topSuppliers = topSuppliers; }
}
