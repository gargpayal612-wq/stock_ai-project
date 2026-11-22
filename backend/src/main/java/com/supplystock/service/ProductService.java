package com.supplystock.service;

import com.supplystock.dto.ProductDTO;
import com.supplystock.entity.Category;
import com.supplystock.entity.Inventory;
import com.supplystock.entity.Product;
import com.supplystock.repository.CategoryRepository;
import com.supplystock.repository.InventoryRepository;
import com.supplystock.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final InventoryRepository inventoryRepository;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository,
                          InventoryRepository inventoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.inventoryRepository = inventoryRepository;
    }

    public List<ProductDTO> getAllProducts(String query, Long categoryId) {
        List<Product> products;
        if (query != null && !query.trim().isEmpty()) {
            products = productRepository.searchProducts(query.trim());
        } else if (categoryId != null) {
            products = productRepository.findByCategoryId(categoryId);
        } else {
            products = productRepository.findByIsActiveTrue();
        }

        return products.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + id));
        return toDTO(product);
    }

    @Transactional
    public ProductDTO createProduct(ProductDTO dto) {
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found with id: " + dto.getCategoryId()));

        Product product = new Product();
        product.setName(dto.getName());
        product.setSku(dto.getSku());
        product.setCategory(category);
        product.setDescription(dto.getDescription());
        product.setCostPrice(dto.getCostPrice());
        product.setSellingPrice(dto.getSellingPrice());
        product.setUnit(dto.getUnit() != null ? dto.getUnit() : "units");
        product.setReorderThreshold(dto.getReorderThreshold() != null ? dto.getReorderThreshold() : 10);
        product.setMinSafetyStock(dto.getMinSafetyStock() != null ? dto.getMinSafetyStock() : 5);
        product.setLeadTimeDays(dto.getLeadTimeDays() != null ? dto.getLeadTimeDays() : 7);
        product.setIsActive(true);

        Product saved = productRepository.save(product);
        return toDTO(saved);
    }

    @Transactional
    public ProductDTO updateProduct(Long id, ProductDTO dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + id));

        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new IllegalArgumentException("Category not found with id: " + dto.getCategoryId()));
            product.setCategory(category);
        }

        if (dto.getName() != null) product.setName(dto.getName());
        if (dto.getCostPrice() != null) product.setCostPrice(dto.getCostPrice());
        if (dto.getSellingPrice() != null) product.setSellingPrice(dto.getSellingPrice());
        if (dto.getReorderThreshold() != null) product.setReorderThreshold(dto.getReorderThreshold());
        if (dto.getMinSafetyStock() != null) product.setMinSafetyStock(dto.getMinSafetyStock());
        if (dto.getDescription() != null) product.setDescription(dto.getDescription());

        return toDTO(productRepository.save(product));
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + id));
        product.setIsActive(false);
        productRepository.save(product);
    }

    public ProductDTO toDTO(Product p) {
        ProductDTO dto = new ProductDTO();
        dto.setId(p.getId());
        dto.setName(p.getName());
        dto.setSku(p.getSku());
        if (p.getCategory() != null) {
            dto.setCategoryId(p.getCategory().getId());
            dto.setCategoryName(p.getCategory().getName());
        }
        dto.setDescription(p.getDescription());
        dto.setCostPrice(p.getCostPrice());
        dto.setSellingPrice(p.getSellingPrice());
        dto.setUnit(p.getUnit());
        dto.setReorderThreshold(p.getReorderThreshold());
        dto.setMinSafetyStock(p.getMinSafetyStock());
        dto.setLeadTimeDays(p.getLeadTimeDays());
        dto.setIsActive(p.getIsActive());
        dto.setCreatedAt(p.getCreatedAt());

        // Calculate aggregated stock across warehouses
        List<Inventory> inventories = inventoryRepository.findByProductId(p.getId());
        int totalAvailable = inventories.stream().mapToInt(Inventory::getAvailableStock).sum();
        int totalIncoming = inventories.stream().mapToInt(Inventory::getIncomingStock).sum();

        dto.setTotalAvailableStock(totalAvailable);
        dto.setTotalIncomingStock(totalIncoming);

        if (totalAvailable == 0) {
            dto.setStockStatus("OUT_OF_STOCK");
        } else if (totalAvailable <= p.getReorderThreshold()) {
            dto.setStockStatus("LOW_STOCK");
        } else {
            dto.setStockStatus("HEALTHY");
        }

        return dto;
    }
}
