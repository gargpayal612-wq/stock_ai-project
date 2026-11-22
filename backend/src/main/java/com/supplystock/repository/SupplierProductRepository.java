package com.supplystock.repository;

import com.supplystock.entity.SupplierProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SupplierProductRepository extends JpaRepository<SupplierProduct, Long> {
    List<SupplierProduct> findByProductId(Long productId);
    List<SupplierProduct> findBySupplierId(Long supplierId);
    Optional<SupplierProduct> findByProductIdAndIsPreferredTrue(Long productId);
    Optional<SupplierProduct> findBySupplierIdAndProductId(Long supplierId, Long productId);
}
