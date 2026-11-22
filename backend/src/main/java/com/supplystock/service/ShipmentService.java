package com.supplystock.service;

import com.supplystock.dto.ShipmentDTO;
import com.supplystock.entity.Shipment;
import com.supplystock.repository.ShipmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShipmentService {

    private final ShipmentRepository shipmentRepository;

    public ShipmentService(ShipmentRepository shipmentRepository) {
        this.shipmentRepository = shipmentRepository;
    }

    public List<ShipmentDTO> getAllShipments() {
        return shipmentRepository.findByOrderByCreatedAtDesc().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public ShipmentDTO getShipmentById(Long id) {
        Shipment s = shipmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Shipment not found with id: " + id));
        return toDTO(s);
    }

    @Transactional
    public ShipmentDTO updateStatus(Long id, String status, String notes) {
        Shipment s = shipmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Shipment not found with id: " + id));

        s.setCurrentStatus(status.toUpperCase());
        s.setLastUpdatedAt(LocalDateTime.now());
        if (notes != null) {
            s.setNotes((s.getNotes() != null ? s.getNotes() + " | " : "") + notes);
        }

        if (status.equalsIgnoreCase("DELIVERED")) {
            s.setActualDeliveryDate(LocalDate.now());
            s.setDelayRiskLevel("LOW");
            s.setDelayRiskScore(BigDecimal.ZERO);
        } else if (status.equalsIgnoreCase("DELAYED")) {
            s.setDelayRiskLevel("HIGH");
            s.setDelayRiskScore(BigDecimal.valueOf(0.85));
        }

        return toDTO(shipmentRepository.save(s));
    }

    public ShipmentDTO toDTO(Shipment s) {
        ShipmentDTO dto = new ShipmentDTO();
        dto.setId(s.getId());
        dto.setTrackingNumber(s.getTrackingNumber());
        if (s.getPurchaseOrder() != null) {
            dto.setPurchaseOrderId(s.getPurchaseOrder().getId());
            dto.setPoNumber(s.getPurchaseOrder().getPoNumber());
            if (s.getPurchaseOrder().getSupplier() != null) {
                dto.setSupplierName(s.getPurchaseOrder().getSupplier().getName());
            }
        }
        dto.setCarrierName(s.getCarrierName());
        dto.setCurrentStatus(s.getCurrentStatus());
        dto.setOriginLocation(s.getOriginLocation());
        if (s.getDestinationWarehouse() != null) {
            dto.setDestinationWarehouseId(s.getDestinationWarehouse().getId());
            dto.setDestinationWarehouseName(s.getDestinationWarehouse().getName());
        }
        dto.setDispatchedDate(s.getDispatchedDate());
        dto.setEstimatedDeliveryDate(s.getEstimatedDeliveryDate());
        dto.setActualDeliveryDate(s.getActualDeliveryDate());
        dto.setDelayRiskLevel(s.getDelayRiskLevel());
        dto.setDelayRiskScore(s.getDelayRiskScore());
        dto.setDelayReason(s.getDelayReason());
        dto.setNotes(s.getNotes());
        return dto;
    }
}
