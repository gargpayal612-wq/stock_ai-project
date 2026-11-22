package com.supplystock.repository;

import com.supplystock.entity.InventoryMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InventoryMovementRepository extends JpaRepository<InventoryMovement, Long> {
    List<InventoryMovement> findByProductIdOrderByCreatedAtDesc(Long productId);
    List<InventoryMovement> findByWarehouseIdOrderByCreatedAtDesc(Long warehouseId);
    List<InventoryMovement> findTop50ByOrderByCreatedAtDesc();
}
