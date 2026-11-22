package com.supplystock.controller;

import com.supplystock.dto.ForecastDTOs.*;
import com.supplystock.service.ForecastService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/forecast")
@CrossOrigin(origins = "*")
public class ForecastController {

    private final ForecastService forecastService;

    public ForecastController(ForecastService forecastService) {
        this.forecastService = forecastService;
    }

    @GetMapping
    public ResponseEntity<List<ForecastResponseDTO>> getForecasts() {
        return ResponseEntity.ok(forecastService.getLatestForecasts());
    }

    @PostMapping("/predict")
    public ResponseEntity<ForecastResponseDTO> predictProductDemand(@RequestBody ForecastRequestDTO request) {
        return ResponseEntity.ok(forecastService.generateProductForecast(request.getProductId(), request.getHorizonDays()));
    }
}
