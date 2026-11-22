package com.supplystock.repository;

import com.supplystock.entity.Shipment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ShipmentRepository extends JpaRepository<Shipment, Long> {
    Optional<Shipment> findByTrackingNumber(String trackingNumber);
    List<Shipment> findByCurrentStatus(String currentStatus);
    List<Shipment> findByCurrentStatusIn(List<String> statuses);
    List<Shipment> findByDelayRiskLevel(String delayRiskLevel);
    List<Shipment> findByOrderByCreatedAtDesc();
    Long countByCurrentStatusIn(List<String> statuses);
    Long countByCurrentStatusOrDelayRiskLevel(String status, String riskLevel);
}
