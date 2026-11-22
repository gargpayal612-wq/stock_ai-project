package com.supplystock.controller;

import com.supplystock.dto.AlertDTO;
import com.supplystock.service.AlertService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/alerts")
@CrossOrigin(origins = "*")
public class AlertController {

    private final AlertService alertService;

    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    @GetMapping
    public ResponseEntity<List<AlertDTO>> getAlerts(
            @RequestParam(required = false) Boolean unresolvedOnly) {
        return ResponseEntity.ok(alertService.getAlerts(unresolvedOnly));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<AlertDTO> markRead(@PathVariable Long id) {
        return ResponseEntity.ok(alertService.markAsRead(id));
    }

    @PatchMapping("/{id}/resolve")
    public ResponseEntity<AlertDTO> resolveAlert(@PathVariable Long id) {
        return ResponseEntity.ok(alertService.resolveAlert(id));
    }
}
