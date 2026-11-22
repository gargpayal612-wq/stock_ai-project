package com.supplystock.service;

import com.supplystock.dto.SaleDTOs.*;
import com.supplystock.entity.*;
import com.supplystock.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SalesService {

    private final SaleRepository saleRepository;
    private final SaleItemRepository saleItemRepository;
    private final InventoryRepository inventoryRepository;
    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;
    private final InventoryMovementRepository movementRepository;

    public SalesService(SaleRepository saleRepository, SaleItemRepository saleItemRepository,
                        InventoryRepository inventoryRepository, ProductRepository productRepository,
                        WarehouseRepository warehouseRepository, InventoryMovementRepository movementRepository) {
        this.saleRepository = saleRepository;
        this.saleItemRepository = saleItemRepository;
        this.inventoryRepository = inventoryRepository;
        this.productRepository = productRepository;
        this.warehouseRepository = warehouseRepository;
        this.movementRepository = movementRepository;
    }

    public List<SaleResponseDTO> getAllSales() {
        return saleRepository.findTop20ByOrderByCreatedAtDesc().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public SaleResponseDTO getSaleById(Long id) {
        Sale sale = saleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Sale not found with id: " + id));
        return toDTO(sale);
    }

    @Transactional
    public SaleResponseDTO createSale(CreateSaleRequest request) {
        Warehouse warehouse = warehouseRepository.findById(request.getWarehouseId())
                .orElseThrow(() -> new IllegalArgumentException("Warehouse not found with id: " + request.getWarehouseId()));

        // STEP 1: Strict validation of stock availability before modifying anything
        for (SaleItemRequest itemReq : request.getItems()) {
            Inventory inv = inventoryRepository.findByProductIdAndWarehouseId(itemReq.getProductId(), warehouse.getId())
                    .orElseThrow(() -> new IllegalArgumentException("No inventory record for product ID: " + itemReq.getProductId()));

            if (inv.getAvailableStock() < itemReq.getQuantity()) {
                Product p = inv.getProduct();
                throw new IllegalStateException("Insufficient stock for product '" + p.getName() + "' (SKU: " + p.getSku() + 
                                                "). Requested: " + itemReq.getQuantity() + ", Available: " + inv.getAvailableStock());
            }
        }

        // STEP 2: Create Sale Header
        Sale sale = new Sale();
        String orderNumber = "SO-" + LocalDate.now().getYear() + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        sale.setSaleOrderNumber(orderNumber);
        sale.setCustomerName(request.getCustomerName());
        sale.setCustomerType(request.getCustomerType() != null ? request.getCustomerType() : "RETAIL");
        sale.setWarehouse(warehouse);
        sale.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "CREDIT_CARD");
        sale.setPaymentStatus("PAID");
        sale.setSaleDate(LocalDate.now());
        sale.setNotes(request.getNotes());
        sale.setDiscountAmount(request.getDiscountAmount() != null ? request.getDiscountAmount() : BigDecimal.ZERO);

        BigDecimal subtotalSum = BigDecimal.ZERO;
        List<SaleItem> saleItems = new ArrayList<>();

        // STEP 3: Create Sale Items & Decrement Inventory atomically
        for (SaleItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found"));

            Inventory inv = inventoryRepository.findByProductIdAndWarehouseId(product.getId(), warehouse.getId()).get();

            int prevStock = inv.getAvailableStock();
            int newStock = prevStock - itemReq.getQuantity();
            inv.setAvailableStock(newStock);
            inventoryRepository.save(inv);

            // Record movement ledger
            InventoryMovement movement = new InventoryMovement();
            movement.setProduct(product);
            movement.setWarehouse(warehouse);
            movement.setMovementType("SALE");
            movement.setQuantity(-itemReq.getQuantity());
            movement.setPreviousStock(prevStock);
            movement.setNewStock(newStock);
            movement.setReferenceId(orderNumber);
            movement.setReferenceType("SALE_ORDER");
            movement.setNotes("Sale order fulfillment for " + request.getCustomerName());
            movementRepository.save(movement);

            // Calculate item price
            BigDecimal itemSubtotal = itemReq.getUnitPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            BigDecimal itemDiscount = itemReq.getDiscount() != null ? itemReq.getDiscount() : BigDecimal.ZERO;
            BigDecimal itemTotal = itemSubtotal.subtract(itemDiscount);
            subtotalSum = subtotalSum.add(itemTotal);

            SaleItem item = new SaleItem();
            item.setSale(sale);
            item.setProduct(product);
            item.setQuantity(itemReq.getQuantity());
            item.setUnitPrice(itemReq.getUnitPrice());
            item.setSubtotal(itemSubtotal);
            item.setDiscount(itemDiscount);
            item.setTotalPrice(itemTotal);
            saleItems.add(item);
        }

        BigDecimal tax = subtotalSum.multiply(BigDecimal.valueOf(0.07)); // 7% standard tax
        BigDecimal finalAmount = subtotalSum.add(tax).subtract(sale.getDiscountAmount());

        sale.setTotalAmount(subtotalSum);
        sale.setTaxAmount(tax);
        sale.setFinalAmount(finalAmount);
        sale.setItems(saleItems);

        Sale savedSale = saleRepository.save(sale);
        return toDTO(savedSale);
    }

    public SaleResponseDTO toDTO(Sale sale) {
        SaleResponseDTO dto = new SaleResponseDTO();
        dto.setId(sale.getId());
        dto.setSaleOrderNumber(sale.getSaleOrderNumber());
        dto.setCustomerName(sale.getCustomerName());
        dto.setCustomerType(sale.getCustomerType());
        if (sale.getWarehouse() != null) {
            dto.setWarehouseName(sale.getWarehouse().getName());
        }
        dto.setTotalAmount(sale.getTotalAmount());
        dto.setTaxAmount(sale.getTaxAmount());
        dto.setDiscountAmount(sale.getDiscountAmount());
        dto.setFinalAmount(sale.getFinalAmount());
        dto.setPaymentStatus(sale.getPaymentStatus());
        dto.setPaymentMethod(sale.getPaymentMethod());
        dto.setSaleDate(sale.getSaleDate());

        List<SaleItemDTO> itemDTOs = sale.getItems().stream().map(item -> {
            SaleItemDTO iDto = new SaleItemDTO();
            iDto.setId(item.getId());
            iDto.setProductId(item.getProduct().getId());
            iDto.setProductName(item.getProduct().getName());
            iDto.setSku(item.getProduct().getSku());
            iDto.setQuantity(item.getQuantity());
            iDto.setUnitPrice(item.getUnitPrice());
            iDto.setSubtotal(item.getSubtotal());
            iDto.setDiscount(item.getDiscount());
            iDto.setTotalPrice(item.getTotalPrice());
            return iDto;
        }).collect(Collectors.toList());

        dto.setItems(itemDTOs);
        return dto;
    }
}
