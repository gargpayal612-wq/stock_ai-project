package com.supplystock.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class ShipmentDTO {
    private Long id;
    private String trackingNumber;
    private Long purchaseOrderId;
    private String poNumber;
    private String supplierName;
    private String carrierName;
    private String currentStatus;
    private String originLocation;
    private Long destinationWarehouseId;
    private String destinationWarehouseName;
    private LocalDateTime dispatchedDate;
    private LocalDate estimatedDeliveryDate;
    private LocalDate actualDeliveryDate;
    private String delayRiskLevel;
    private BigDecimal delayRiskScore;
    private String delayReason;
    private String notes;

    public ShipmentDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTrackingNumber() { return trackingNumber; }
    public void setTrackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; }
    public Long getPurchaseOrderId() { return purchaseOrderId; }
    public void setPurchaseOrderId(Long purchaseOrderId) { this.purchaseOrderId = purchaseOrderId; }
    public String getPoNumber() { return poNumber; }
    public void setPoNumber(String poNumber) { this.poNumber = poNumber; }
    public String getSupplierName() { return supplierName; }
    public void setSupplierName(String supplierName) { this.supplierName = supplierName; }
    public String getCarrierName() { return carrierName; }
    public void setCarrierName(String carrierName) { this.carrierName = carrierName; }
    public String getCurrentStatus() { return currentStatus; }
    public void setCurrentStatus(String currentStatus) { this.currentStatus = currentStatus; }
    public String getOriginLocation() { return originLocation; }
    public void setOriginLocation(String originLocation) { this.originLocation = originLocation; }
    public Long getDestinationWarehouseId() { return destinationWarehouseId; }
    public void setDestinationWarehouseId(Long destinationWarehouseId) { this.destinationWarehouseId = destinationWarehouseId; }
    public String getDestinationWarehouseName() { return destinationWarehouseName; }
    public void setDestinationWarehouseName(String destinationWarehouseName) { this.destinationWarehouseName = destinationWarehouseName; }
    public LocalDateTime getDispatchedDate() { return dispatchedDate; }
    public void setDispatchedDate(LocalDateTime dispatchedDate) { this.dispatchedDate = dispatchedDate; }
    public LocalDate getEstimatedDeliveryDate() { return estimatedDeliveryDate; }
    public void setEstimatedDeliveryDate(LocalDate estimatedDeliveryDate) { this.estimatedDeliveryDate = estimatedDeliveryDate; }
    public LocalDate getActualDeliveryDate() { return actualDeliveryDate; }
    public void setActualDeliveryDate(LocalDate actualDeliveryDate) { this.actualDeliveryDate = actualDeliveryDate; }
    public String getDelayRiskLevel() { return delayRiskLevel; }
    public void setDelayRiskLevel(String delayRiskLevel) { this.delayRiskLevel = delayRiskLevel; }
    public BigDecimal getDelayRiskScore() { return delayRiskScore; }
    public void setDelayRiskScore(BigDecimal delayRiskScore) { this.delayRiskScore = delayRiskScore; }
    public String getDelayReason() { return delayReason; }
    public void setDelayReason(String delayReason) { this.delayReason = delayReason; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
