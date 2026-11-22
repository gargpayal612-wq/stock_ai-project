package com.supplystock.repository;

import com.supplystock.entity.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {
    List<Alert> findByIsResolvedFalseOrderByCreatedAtDesc();
    List<Alert> findByIsReadFalseOrderByCreatedAtDesc();
    List<Alert> findTop30ByOrderByCreatedAtDesc();
    Long countByIsReadFalse();
    Long countByIsResolvedFalse();
}
