package com.supplystock.controller;

import com.supplystock.dto.InventoryDTO;
import com.supplystock.entity.InventoryMovement;
import com.supplystock.service.InventoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/inventory")
@CrossOrigin(origins = "*")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping
    public ResponseEntity<List<InventoryDTO>> getInventory(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long warehouseId,
            @RequestParam(required = false) Boolean lowStockOnly) {
        return ResponseEntity.ok(inventoryService.getInventory(categoryId, warehouseId, lowStockOnly));
    }

    @PostMapping("/adjust")
    public ResponseEntity<InventoryDTO> adjustStock(
            @RequestParam Long productId,
            @RequestParam Long warehouseId,
            @RequestParam int deltaQuantity,
            @RequestParam(required = false) String reason) {
        return ResponseEntity.ok(inventoryService.adjustStock(productId, warehouseId, deltaQuantity, reason));
    }

    @GetMapping("/movements")
    public ResponseEntity<List<InventoryMovement>> getMovements(
            @RequestParam(required = false) Long productId) {
        if (productId != null) {
            return ResponseEntity.ok(inventoryService.getProductMovements(productId));
        }
        return ResponseEntity.ok(inventoryService.getRecentMovements());
    }
}
