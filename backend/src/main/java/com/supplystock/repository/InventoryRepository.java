package com.supplystock.repository;

import com.supplystock.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    Optional<Inventory> findByProductIdAndWarehouseId(Long productId, Long warehouseId);
    List<Inventory> findByProductId(Long productId);
    List<Inventory> findByWarehouseId(Long warehouseId);

    @Query("SELECT i FROM Inventory i WHERE i.availableStock <= i.product.reorderThreshold")
    List<Inventory> findLowStockInventories();

    @Query("SELECT i FROM Inventory i WHERE i.availableStock = 0")
    List<Inventory> findOutOfStockInventories();

    @Query("SELECT SUM(i.availableStock * i.product.costPrice) FROM Inventory i")
    Double calculateTotalCostInventoryValue();

    @Query("SELECT SUM(i.availableStock * i.product.sellingPrice) FROM Inventory i")
    Double calculateTotalRetailInventoryValue();
}
