package com.supplystock.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class PurchaseOrderDTOs {

    public static class POItemRequest {
        @NotNull(message = "Product ID is required")
        private Long productId;

        @NotNull(message = "Ordered quantity is required")
        private Integer orderedQuantity;

        @NotNull(message = "Unit cost is required")
        private BigDecimal unitCost;

        public POItemRequest() {}

        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }
        public Integer getOrderedQuantity() { return orderedQuantity; }
        public void setOrderedQuantity(Integer orderedQuantity) { this.orderedQuantity = orderedQuantity; }
        public BigDecimal getUnitCost() { return unitCost; }
        public void setUnitCost(BigDecimal unitCost) { this.unitCost = unitCost; }
    }

    public static class CreatePORequest {
        @NotNull(message = "Supplier ID is required")
        private Long supplierId;

        @NotNull(message = "Warehouse ID is required")
        private Long warehouseId;

        @NotNull(message = "Expected delivery date is required")
        private LocalDate expectedDeliveryDate;

        private String notes;

        @NotEmpty(message = "Purchase order must contain items")
        private List<POItemRequest> items;

        public CreatePORequest() {}

        public Long getSupplierId() { return supplierId; }
        public void setSupplierId(Long supplierId) { this.supplierId = supplierId; }
        public Long getWarehouseId() { return warehouseId; }
        public void setWarehouseId(Long warehouseId) { this.warehouseId = warehouseId; }
        public LocalDate getExpectedDeliveryDate() { return expectedDeliveryDate; }
        public void setExpectedDeliveryDate(LocalDate expectedDeliveryDate) { this.expectedDeliveryDate = expectedDeliveryDate; }
        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
        public List<POItemRequest> getItems() { return items; }
        public void setItems(List<POItemRequest> items) { this.items = items; }
    }

    public static class UpdateStatusRequest {
        @NotNull(message = "Status is required")
        private String status;
        private String notes;

        public UpdateStatusRequest() {}

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
    }

    public static class POItemDTO {
        private Long id;
        private Long productId;
        private String productName;
        private String sku;
        private Integer orderedQuantity;
        private Integer receivedQuantity;
        private BigDecimal unitCost;
        private BigDecimal subtotalCost;
        private String status;

        public POItemDTO() {}

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }
        public String getProductName() { return productName; }
        public void setProductName(String productName) { this.productName = productName; }
        public String getSku() { return sku; }
        public void setSku(String sku) { this.sku = sku; }
        public Integer getOrderedQuantity() { return orderedQuantity; }
        public void setOrderedQuantity(Integer orderedQuantity) { this.orderedQuantity = orderedQuantity; }
        public Integer getReceivedQuantity() { return receivedQuantity; }
        public void setReceivedQuantity(Integer receivedQuantity) { this.receivedQuantity = receivedQuantity; }
        public BigDecimal getUnitCost() { return unitCost; }
        public void setUnitCost(BigDecimal unitCost) { this.unitCost = unitCost; }
        public BigDecimal getSubtotalCost() { return subtotalCost; }
        public void setSubtotalCost(BigDecimal subtotalCost) { this.subtotalCost = subtotalCost; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    public static class POResponseDTO {
        private Long id;
        private String poNumber;
        private Long supplierId;
        private String supplierName;
        private Long warehouseId;
        private String warehouseName;
        private BigDecimal totalAmount;
        private String status;
        private LocalDate expectedDeliveryDate;
        private LocalDate actualDeliveryDate;
        private String notes;
        private LocalDateTime createdAt;
        private List<POItemDTO> items;

        public POResponseDTO() {}

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getPoNumber() { return poNumber; }
        public void setPoNumber(String poNumber) { this.poNumber = poNumber; }
        public Long getSupplierId() { return supplierId; }
        public void setSupplierId(Long supplierId) { this.supplierId = supplierId; }
        public String getSupplierName() { return supplierName; }
        public void setSupplierName(String supplierName) { this.supplierName = supplierName; }
        public Long getWarehouseId() { return warehouseId; }
        public void setWarehouseId(Long warehouseId) { this.warehouseId = warehouseId; }
        public String getWarehouseName() { return warehouseName; }
        public void setWarehouseName(String warehouseName) { this.warehouseName = warehouseName; }
        public BigDecimal getTotalAmount() { return totalAmount; }
        public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public LocalDate getExpectedDeliveryDate() { return expectedDeliveryDate; }
        public void setExpectedDeliveryDate(LocalDate expectedDeliveryDate) { this.expectedDeliveryDate = expectedDeliveryDate; }
        public LocalDate getActualDeliveryDate() { return actualDeliveryDate; }
        public void setActualDeliveryDate(LocalDate actualDeliveryDate) { this.actualDeliveryDate = actualDeliveryDate; }
        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
        public List<POItemDTO> getItems() { return items; }
        public void setItems(List<POItemDTO> items) { this.items = items; }
    }

    public static class RestockRecommendationDTO {
        private Long productId;
        private String productName;
        private String sku;
        private String categoryName;
        private Integer currentStock;
        private Integer incomingStock;
        private Integer safetyStock;
        private Integer predictedDemand;
        private Integer recommendedPurchaseQuantity;
        private Long preferredSupplierId;
        private String preferredSupplierName;
        private BigDecimal supplierUnitPrice;
        private BigDecimal supplierReliability;

        public RestockRecommendationDTO() {}

        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }
        public String getProductName() { return productName; }
        public void setProductName(String productName) { this.productName = productName; }
        public String getSku() { return sku; }
        public void setSku(String sku) { this.sku = sku; }
        public String getCategoryName() { return categoryName; }
        public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
        public Integer getCurrentStock() { return currentStock; }
        public void setCurrentStock(Integer currentStock) { this.currentStock = currentStock; }
        public Integer getIncomingStock() { return incomingStock; }
        public void setIncomingStock(Integer incomingStock) { this.incomingStock = incomingStock; }
        public Integer getSafetyStock() { return safetyStock; }
        public void setSafetyStock(Integer safetyStock) { this.safetyStock = safetyStock; }
        public Integer getPredictedDemand() { return predictedDemand; }
        public void setPredictedDemand(Integer predictedDemand) { this.predictedDemand = predictedDemand; }
        public Integer getRecommendedPurchaseQuantity() { return recommendedPurchaseQuantity; }
        public void setRecommendedPurchaseQuantity(Integer recommendedPurchaseQuantity) { this.recommendedPurchaseQuantity = recommendedPurchaseQuantity; }
        public Long getPreferredSupplierId() { return preferredSupplierId; }
        public void setPreferredSupplierId(Long preferredSupplierId) { this.preferredSupplierId = preferredSupplierId; }
        public String getPreferredSupplierName() { return preferredSupplierName; }
        public void setPreferredSupplierName(String preferredSupplierName) { this.preferredSupplierName = preferredSupplierName; }
        public BigDecimal getSupplierUnitPrice() { return supplierUnitPrice; }
        public void setSupplierUnitPrice(BigDecimal supplierUnitPrice) { this.supplierUnitPrice = supplierUnitPrice; }
        public BigDecimal getSupplierReliability() { return supplierReliability; }
        public void setSupplierReliability(BigDecimal supplierReliability) { this.supplierReliability = supplierReliability; }
    }
}
