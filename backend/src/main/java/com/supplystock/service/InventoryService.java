package com.supplystock.service;

import com.supplystock.dto.InventoryDTO;
import com.supplystock.entity.Inventory;
import com.supplystock.entity.InventoryMovement;
import com.supplystock.entity.Product;
import com.supplystock.entity.Warehouse;
import com.supplystock.repository.InventoryMovementRepository;
import com.supplystock.repository.InventoryRepository;
import com.supplystock.repository.ProductRepository;
import com.supplystock.repository.WarehouseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;
    private final InventoryMovementRepository movementRepository;

    public InventoryService(InventoryRepository inventoryRepository, ProductRepository productRepository,
                            WarehouseRepository warehouseRepository, InventoryMovementRepository movementRepository) {
        this.inventoryRepository = inventoryRepository;
        this.productRepository = productRepository;
        this.warehouseRepository = warehouseRepository;
        this.movementRepository = movementRepository;
    }

    public List<InventoryDTO> getInventory(Long categoryId, Long warehouseId, Boolean lowStockOnly) {
        List<Inventory> list;
        if (warehouseId != null) {
            list = inventoryRepository.findByWarehouseId(warehouseId);
        } else if (lowStockOnly != null && lowStockOnly) {
            list = inventoryRepository.findLowStockInventories();
        } else {
            list = inventoryRepository.findAll();
        }

        if (categoryId != null) {
            list = list.stream()
                    .filter(i -> i.getProduct().getCategory() != null && i.getProduct().getCategory().getId().equals(categoryId))
                    .collect(Collectors.toList());
        }

        return list.stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public InventoryDTO adjustStock(Long productId, Long warehouseId, int deltaQuantity, String reason) {
        Inventory inventory = inventoryRepository.findByProductIdAndWarehouseId(productId, warehouseId)
                .orElseGet(() -> {
                    Product p = productRepository.findById(productId)
                            .orElseThrow(() -> new IllegalArgumentException("Product not found"));
                    Warehouse w = warehouseRepository.findById(warehouseId)
                            .orElseThrow(() -> new IllegalArgumentException("Warehouse not found"));
                    Inventory inv = new Inventory();
                    inv.setProduct(p);
                    inv.setWarehouse(w);
                    inv.setAvailableStock(0);
                    inv.setReservedStock(0);
                    inv.setIncomingStock(0);
                    return inv;
                });

        int prevStock = inventory.getAvailableStock();
        int newStock = prevStock + deltaQuantity;
        if (newStock < 0) {
            throw new IllegalArgumentException("Resulting inventory quantity cannot be negative");
        }

        inventory.setAvailableStock(newStock);
        inventory.setUpdatedAt(LocalDateTime.now());
        Inventory saved = inventoryRepository.save(inventory);

        // Record in immutable ledger
        InventoryMovement movement = new InventoryMovement();
        movement.setProduct(inventory.getProduct());
        movement.setWarehouse(inventory.getWarehouse());
        movement.setMovementType(deltaQuantity >= 0 ? "IN" : "OUT");
        movement.setQuantity(deltaQuantity);
        movement.setPreviousStock(prevStock);
        movement.setNewStock(newStock);
        movement.setReferenceType("MANUAL_ADJUSTMENT");
        movement.setNotes(reason != null ? reason : "Manual warehouse inventory stock adjustment");
        movementRepository.save(movement);

        return toDTO(saved);
    }

    public List<InventoryMovement> getRecentMovements() {
        return movementRepository.findTop50ByOrderByCreatedAtDesc();
    }

    public List<InventoryMovement> getProductMovements(Long productId) {
        return movementRepository.findByProductIdOrderByCreatedAtDesc(productId);
    }

    public InventoryDTO toDTO(Inventory inv) {
        InventoryDTO dto = new InventoryDTO();
        dto.setId(inv.getId());
        dto.setProductId(inv.getProduct().getId());
        dto.setProductName(inv.getProduct().getName());
        dto.setSku(inv.getProduct().getSku());
        if (inv.getProduct().getCategory() != null) {
            dto.setCategoryName(inv.getProduct().getCategory().getName());
        }
        dto.setWarehouseId(inv.getWarehouse().getId());
        dto.setWarehouseName(inv.getWarehouse().getName());
        dto.setWarehouseCode(inv.getWarehouse().getCode());
        dto.setAvailableStock(inv.getAvailableStock());
        dto.setReservedStock(inv.getReservedStock());
        dto.setIncomingStock(inv.getIncomingStock());
        dto.setReorderThreshold(inv.getProduct().getReorderThreshold());
        dto.setLastRestockedAt(inv.getLastRestockedAt());

        if (inv.getAvailableStock() == 0) {
            dto.setStockStatus("OUT_OF_STOCK");
        } else if (inv.getAvailableStock() <= inv.getProduct().getReorderThreshold()) {
            dto.setStockStatus("LOW_STOCK");
        } else {
            dto.setStockStatus("HEALTHY");
        }

        return dto;
    }
}
