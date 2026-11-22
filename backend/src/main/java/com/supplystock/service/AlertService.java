package com.supplystock.service;

import com.supplystock.dto.AlertDTO;
import com.supplystock.entity.Alert;
import com.supplystock.repository.AlertRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AlertService {

    private final AlertRepository alertRepository;

    public AlertService(AlertRepository alertRepository) {
        this.alertRepository = alertRepository;
    }

    public List<AlertDTO> getAlerts(Boolean unresolvedOnly) {
        List<Alert> alerts;
        if (unresolvedOnly != null && unresolvedOnly) {
            alerts = alertRepository.findByIsResolvedFalseOrderByCreatedAtDesc();
        } else {
            alerts = alertRepository.findTop30ByOrderByCreatedAtDesc();
        }
        return alerts.stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public AlertDTO markAsRead(Long id) {
        Alert alert = alertRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Alert not found with id: " + id));
        alert.setIsRead(true);
        return toDTO(alertRepository.save(alert));
    }

    @Transactional
    public AlertDTO resolveAlert(Long id) {
        Alert alert = alertRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Alert not found with id: " + id));
        alert.setIsRead(true);
        alert.setIsResolved(true);
        alert.setResolvedAt(LocalDateTime.now());
        return toDTO(alertRepository.save(alert));
    }

    @Transactional
    public AlertDTO createAlert(String title, String message, String alertType, String severity, String refId, String refType) {
        Alert alert = new Alert();
        alert.setTitle(title);
        alert.setMessage(message);
        alert.setAlertType(alertType);
        alert.setSeverity(severity);
        alert.setReferenceId(refId);
        alert.setReferenceType(refType);
        alert.setIsRead(false);
        alert.setIsResolved(false);
        return toDTO(alertRepository.save(alert));
    }

    public AlertDTO toDTO(Alert a) {
        AlertDTO dto = new AlertDTO();
        dto.setId(a.getId());
        dto.setTitle(a.getTitle());
        dto.setMessage(a.getMessage());
        dto.setAlertType(a.getAlertType());
        dto.setSeverity(a.getSeverity());
        dto.setReferenceId(a.getReferenceId());
        dto.setReferenceType(a.getReferenceType());
        dto.setIsRead(a.getIsRead());
        dto.setIsResolved(a.getIsResolved());
        dto.setCreatedAt(a.getCreatedAt());
        return dto;
    }
}
