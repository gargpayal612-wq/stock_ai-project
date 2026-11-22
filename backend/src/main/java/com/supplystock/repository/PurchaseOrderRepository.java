package com.supplystock.repository;

import com.supplystock.entity.PurchaseOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {
    Optional<PurchaseOrder> findByPoNumber(String poNumber);
    List<PurchaseOrder> findByStatus(String status);
    List<PurchaseOrder> findBySupplierId(Long supplierId);
    List<PurchaseOrder> findByOrderByCreatedAtDesc();
    Long countByStatusIn(List<String> statuses);
}
