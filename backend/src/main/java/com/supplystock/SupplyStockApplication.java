package com.supplystock;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SupplyStockApplication {

    public static void main(String[] args) {
        SpringApplication.run(SupplyStockApplication.class, args);
    }
}
