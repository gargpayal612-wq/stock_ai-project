package com.supplystock.service;

import com.supplystock.dto.PurchaseOrderDTOs.*;
import com.supplystock.entity.*;
import com.supplystock.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PurchaseOrderService {

    private final PurchaseOrderRepository poRepository;
    private final PurchaseOrderItemRepository poiRepository;
    private final SupplierRepository supplierRepository;
    private final WarehouseRepository warehouseRepository;
    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;
    private final InventoryMovementRepository movementRepository;
    private final SupplierProductRepository supplierProductRepository;
    private final DemandForecastRepository demandForecastRepository;

    public PurchaseOrderService(PurchaseOrderRepository poRepository, PurchaseOrderItemRepository poiRepository,
                                SupplierRepository supplierRepository, WarehouseRepository warehouseRepository,
                                ProductRepository productRepository, InventoryRepository inventoryRepository,
                                InventoryMovementRepository movementRepository, SupplierProductRepository supplierProductRepository,
                                DemandForecastRepository demandForecastRepository) {
        this.poRepository = poRepository;
        this.poiRepository = poiRepository;
        this.supplierRepository = supplierRepository;
        this.warehouseRepository = warehouseRepository;
        this.productRepository = productRepository;
        this.inventoryRepository = inventoryRepository;
        this.movementRepository = movementRepository;
        this.supplierProductRepository = supplierProductRepository;
        this.demandForecastRepository = demandForecastRepository;
    }

    public List<POResponseDTO> getAllPurchaseOrders() {
        return poRepository.findByOrderByCreatedAtDesc().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public POResponseDTO getPurchaseOrderById(Long id) {
        PurchaseOrder po = poRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Purchase order not found with id: " + id));
        return toDTO(po);
    }

    @Transactional
    public POResponseDTO createPurchaseOrder(CreatePORequest req) {
        Supplier supplier = supplierRepository.findById(req.getSupplierId())
                .orElseThrow(() -> new IllegalArgumentException("Supplier not found with id: " + req.getSupplierId()));
        Warehouse warehouse = warehouseRepository.findById(req.getWarehouseId())
                .orElseThrow(() -> new IllegalArgumentException("Warehouse not found with id: " + req.getWarehouseId()));

        PurchaseOrder po = new PurchaseOrder();
        String poNumber = "PO-" + LocalDate.now().getYear() + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        po.setPoNumber(poNumber);
        po.setSupplier(supplier);
        po.setWarehouse(warehouse);
        po.setStatus("PENDING_APPROVAL");
        po.setExpectedDeliveryDate(req.getExpectedDeliveryDate());
        po.setNotes(req.getNotes());

        BigDecimal totalSum = BigDecimal.ZERO;
        List<PurchaseOrderItem> items = new ArrayList<>();

        for (POItemRequest itemReq : req.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + itemReq.getProductId()));

            BigDecimal subtotal = itemReq.getUnitCost().multiply(BigDecimal.valueOf(itemReq.getOrderedQuantity()));
            totalSum = totalSum.add(subtotal);

            PurchaseOrderItem item = new PurchaseOrderItem();
            item.setPurchaseOrder(po);
            item.setProduct(product);
            item.setOrderedQuantity(itemReq.getOrderedQuantity());
            item.setReceivedQuantity(0);
            item.setUnitCost(itemReq.getUnitCost());
            item.setSubtotalCost(subtotal);
            item.setStatus("PENDING");
            items.add(item);

            // Update expected incoming stock on the warehouse
            Inventory inv = inventoryRepository.findByProductIdAndWarehouseId(product.getId(), warehouse.getId())
                    .orElseGet(() -> {
                        Inventory newInv = new Inventory();
                        newInv.setProduct(product);
                        newInv.setWarehouse(warehouse);
                        newInv.setAvailableStock(0);
                        newInv.setReservedStock(0);
                        newInv.setIncomingStock(0);
                        return newInv;
                    });
            inv.setIncomingStock(inv.getIncomingStock() + itemReq.getOrderedQuantity());
            inventoryRepository.save(inv);
        }

        po.setTotalAmount(totalSum);
        po.setItems(items);

        PurchaseOrder saved = poRepository.save(po);
        return toDTO(saved);
    }

    @Transactional
    public POResponseDTO updateStatus(Long id, UpdateStatusRequest req) {
        PurchaseOrder po = poRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Purchase order not found with id: " + id));

        String newStatus = req.getStatus().toUpperCase();
        String oldStatus = po.getStatus();

        if (newStatus.equals("RECEIVED") && !oldStatus.equals("RECEIVED")) {
            // Fulfill and receive entire order into warehouse inventory
            po.setActualDeliveryDate(LocalDate.now());

            for (PurchaseOrderItem item : po.getItems()) {
                int qtyToReceive = item.getOrderedQuantity() - item.getReceivedQuantity();
                item.setReceivedQuantity(item.getOrderedQuantity());
                item.setStatus("RECEIVED");

                Inventory inv = inventoryRepository.findByProductIdAndWarehouseId(item.getProduct().getId(), po.getWarehouse().getId())
                        .orElseThrow(() -> new IllegalStateException("Inventory not found"));

                int prevStock = inv.getAvailableStock();
                int newStock = prevStock + qtyToReceive;

                inv.setAvailableStock(newStock);
                inv.setIncomingStock(Math.max(0, inv.getIncomingStock() - qtyToReceive));
                inv.setLastRestockedAt(LocalDateTime.now());
                inventoryRepository.save(inv);

                // Audit ledger
                InventoryMovement mov = new InventoryMovement();
                mov.setProduct(item.getProduct());
                mov.setWarehouse(po.getWarehouse());
                mov.setMovementType("PO_RECEIPT");
                mov.setQuantity(qtyToReceive);
                mov.setPreviousStock(prevStock);
                mov.setNewStock(newStock);
                mov.setReferenceId(po.getPoNumber());
                mov.setReferenceType("PURCHASE_ORDER");
                mov.setNotes("Receipt of PO goods from supplier: " + po.getSupplier().getName());
                movementRepository.save(mov);
            }

            // Increment supplier completed count
            Supplier sup = po.getSupplier();
            sup.setTotalOrdersCompleted(sup.getTotalOrdersCompleted() + 1);
            supplierRepository.save(sup);
        }

        po.setStatus(newStatus);
        if (req.getNotes() != null) {
            po.setNotes((po.getNotes() != null ? po.getNotes() + " | " : "") + req.getNotes());
        }

        return toDTO(poRepository.save(po));
    }

    public List<RestockRecommendationDTO> getRestockRecommendations() {
        List<Product> products = productRepository.findByIsActiveTrue();
        List<RestockRecommendationDTO> recommendations = new ArrayList<>();

        for (Product p : products) {
            List<Inventory> invList = inventoryRepository.findByProductId(p.getId());
            int avail = invList.stream().mapToInt(Inventory::getAvailableStock).sum();
            int incoming = invList.stream().mapToInt(Inventory::getIncomingStock).sum();
            int safety = p.getMinSafetyStock();

            // Check latest forecast
            int predictedDemand = demandForecastRepository.findTopByProductIdOrderByForecastDateDesc(p.getId())
                    .map(DemandForecast::getMlPredictedDemand)
                    .orElse(p.getReorderThreshold() * 2);

            // Recommended Purchase Quantity = Predicted Demand + Safety Stock − Available Stock − Expected Incoming Stock
            int recommended = Math.max(0, (predictedDemand + safety) - avail - incoming);

            if (recommended > 0 || avail <= p.getReorderThreshold()) {
                RestockRecommendationDTO dto = new RestockRecommendationDTO();
                dto.setProductId(p.getId());
                dto.setProductName(p.getName());
                dto.setSku(p.getSku());
                dto.setCategoryName(p.getCategory() != null ? p.getCategory().getName() : "");
                dto.setCurrentStock(avail);
                dto.setIncomingStock(incoming);
                dto.setSafetyStock(safety);
                dto.setPredictedDemand(predictedDemand);
                dto.setRecommendedPurchaseQuantity(recommended > 0 ? recommended : p.getReorderThreshold());

                // Find preferred supplier
                supplierProductRepository.findByProductIdAndIsPreferredTrue(p.getId()).ifPresent(sp -> {
                    dto.setPreferredSupplierId(sp.getSupplier().getId());
                    dto.setPreferredSupplierName(sp.getSupplier().getName());
                    dto.setSupplierUnitPrice(sp.getUnitPrice());
                    dto.setSupplierReliability(sp.getSupplier().getReliabilityScore());
                });

                recommendations.add(dto);
            }
        }

        recommendations.sort((a, b) -> Integer.compare(b.getRecommendedPurchaseQuantity(), a.getRecommendedPurchaseQuantity()));
        return recommendations;
    }

    public POResponseDTO toDTO(PurchaseOrder po) {
        POResponseDTO dto = new POResponseDTO();
        dto.setId(po.getId());
        dto.setPoNumber(po.getPoNumber());
        if (po.getSupplier() != null) {
            dto.setSupplierId(po.getSupplier().getId());
            dto.setSupplierName(po.getSupplier().getName());
        }
        if (po.getWarehouse() != null) {
            dto.setWarehouseId(po.getWarehouse().getId());
            dto.setWarehouseName(po.getWarehouse().getName());
        }
        dto.setTotalAmount(po.getTotalAmount());
        dto.setStatus(po.getStatus());
        dto.setExpectedDeliveryDate(po.getExpectedDeliveryDate());
        dto.setActualDeliveryDate(po.getActualDeliveryDate());
        dto.setNotes(po.getNotes());
        dto.setCreatedAt(po.getCreatedAt());

        List<POItemDTO> itemDTOs = po.getItems().stream().map(i -> {
            POItemDTO idto = new POItemDTO();
            idto.setId(i.getId());
            idto.setProductId(i.getProduct().getId());
            idto.setProductName(i.getProduct().getName());
            idto.setSku(i.getProduct().getSku());
            idto.setOrderedQuantity(i.getOrderedQuantity());
            idto.setReceivedQuantity(i.getReceivedQuantity());
            idto.setUnitCost(i.getUnitCost());
            idto.setSubtotalCost(i.getSubtotalCost());
            idto.setStatus(i.getStatus());
            return idto;
        }).collect(Collectors.toList());

        dto.setItems(itemDTOs);
        return dto;
    }
}
