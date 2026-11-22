package com.supplystock.controller;

import com.supplystock.dto.PurchaseOrderDTOs.*;
import com.supplystock.service.PurchaseOrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/purchase-orders")
@CrossOrigin(origins = "*")
public class PurchaseOrderController {

    private final PurchaseOrderService poService;

    public PurchaseOrderController(PurchaseOrderService poService) {
        this.poService = poService;
    }

    @GetMapping
    public ResponseEntity<List<POResponseDTO>> getAllPOs() {
        return ResponseEntity.ok(poService.getAllPurchaseOrders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<POResponseDTO> getPO(@PathVariable Long id) {
        return ResponseEntity.ok(poService.getPurchaseOrderById(id));
    }

    @PostMapping
    public ResponseEntity<POResponseDTO> createPO(@Valid @RequestBody CreatePORequest request) {
        return ResponseEntity.ok(poService.createPurchaseOrder(request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<POResponseDTO> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateStatusRequest request) {
        return ResponseEntity.ok(poService.updateStatus(id, request));
    }

    @GetMapping("/recommendations")
    public ResponseEntity<List<RestockRecommendationDTO>> getRecommendations() {
        return ResponseEntity.ok(poService.getRestockRecommendations());
    }
}
