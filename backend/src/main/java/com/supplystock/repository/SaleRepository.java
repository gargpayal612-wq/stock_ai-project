package com.supplystock.repository;

import com.supplystock.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {
    Optional<Sale> findBySaleOrderNumber(String saleOrderNumber);
    List<Sale> findBySaleDateBetweenOrderBySaleDateDesc(LocalDate startDate, LocalDate endDate);
    List<Sale> findTop20ByOrderByCreatedAtDesc();

    @Query("SELECT SUM(s.finalAmount) FROM Sale s WHERE s.paymentStatus = 'PAID'")
    Double calculateTotalSalesRevenue();
}
