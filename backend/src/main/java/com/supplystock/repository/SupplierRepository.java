package com.supplystock.repository;

import com.supplystock.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    Optional<Supplier> findByCode(String code);
    List<Supplier> findByIsActiveTrue();
    List<Supplier> findByOrderByReliabilityScoreDesc();
}
