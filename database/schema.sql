-- =====================================================================
-- SupplyStock AI - Intelligent Inventory & Supply Chain Management System
-- Database Schema (MySQL 8.0+)
-- Relational Design conforming to 1NF, 2NF, 3NF
-- =====================================================================

CREATE DATABASE IF NOT EXISTS `supplystock_db` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `supplystock_db`;

-- Disable foreign key checks during initialization
SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------------------
-- Table 1: roles
-- Role-based access control roles
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL UNIQUE,
    `description` VARCHAR(255) NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Table 2: users
-- Application users across Retailers, Wholesalers, Suppliers, etc.
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(60) NOT NULL UNIQUE,
    `email` VARCHAR(120) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(25) NULL,
    `role_id` BIGINT NOT NULL,
    `company_name` VARCHAR(150) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    `last_login_at` TIMESTAMP NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_users_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX `idx_users_role` ON `users` (`role_id`);
CREATE INDEX `idx_users_email` ON `users` (`email`);

-- ---------------------------------------------------------------------
-- Table 3: categories
-- Product categories for hierarchical categorization
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL UNIQUE,
    `code` VARCHAR(50) NOT NULL UNIQUE,
    `description` TEXT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Table 4: products
-- Master product catalog with SKU, pricing, thresholds
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(150) NOT NULL,
    `sku` VARCHAR(60) NOT NULL UNIQUE,
    `category_id` BIGINT NOT NULL,
    `description` TEXT NULL,
    `cost_price` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `selling_price` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `unit` VARCHAR(30) NOT NULL DEFAULT 'units',
    `reorder_threshold` INT NOT NULL DEFAULT 10,
    `min_safety_stock` INT NOT NULL DEFAULT 5,
    `lead_time_days` INT NOT NULL DEFAULT 7,
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `chk_product_prices` CHECK (`cost_price` >= 0 AND `selling_price` >= 0),
    CONSTRAINT `chk_product_thresholds` CHECK (`reorder_threshold` >= 0 AND `min_safety_stock` >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX `idx_products_sku` ON `products` (`sku`);
CREATE INDEX `idx_products_category` ON `products` (`category_id`);
CREATE INDEX `idx_products_is_active` ON `products` (`is_active`);

-- ---------------------------------------------------------------------
-- Table 5: warehouses
-- Physical warehouse facilities
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `warehouses`;
CREATE TABLE `warehouses` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(120) NOT NULL,
    `code` VARCHAR(40) NOT NULL UNIQUE,
    `location` VARCHAR(255) NOT NULL,
    `capacity_sqft` INT NULL,
    `manager_name` VARCHAR(100) NULL,
    `contact_phone` VARCHAR(25) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX `idx_warehouses_code` ON `warehouses` (`code`);

-- ---------------------------------------------------------------------
-- Table 6: inventory
-- Current inventory quantities per product per warehouse
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `inventory`;
CREATE TABLE `inventory` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `product_id` BIGINT NOT NULL,
    `warehouse_id` BIGINT NOT NULL,
    `available_stock` INT NOT NULL DEFAULT 0,
    `reserved_stock` INT NOT NULL DEFAULT 0,
    `incoming_stock` INT NOT NULL DEFAULT 0,
    `last_restocked_at` TIMESTAMP NULL,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_inventory_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_inventory_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `uq_product_warehouse` UNIQUE (`product_id`, `warehouse_id`),
    CONSTRAINT `chk_inventory_quantities` CHECK (`available_stock` >= 0 AND `reserved_stock` >= 0 AND `incoming_stock` >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX `idx_inventory_product` ON `inventory` (`product_id`);
CREATE INDEX `idx_inventory_warehouse` ON `inventory` (`warehouse_id`);

-- ---------------------------------------------------------------------
-- Table 7: inventory_movements
-- Immutable ledger for inventory audit and movements
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `inventory_movements`;
CREATE TABLE `inventory_movements` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `product_id` BIGINT NOT NULL,
    `warehouse_id` BIGINT NOT NULL,
    `movement_type` ENUM('IN', 'OUT', 'TRANSFER', 'ADJUSTMENT', 'SALE', 'RETURN', 'PO_RECEIPT') NOT NULL,
    `quantity` INT NOT NULL,
    `previous_stock` INT NOT NULL,
    `new_stock` INT NOT NULL,
    `reference_id` VARCHAR(100) NULL,
    `reference_type` VARCHAR(50) NULL,
    `notes` TEXT NULL,
    `created_by_user_id` BIGINT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_inv_mov_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_inv_mov_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_inv_mov_user` FOREIGN KEY (`created_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX `idx_movements_product` ON `inventory_movements` (`product_id`);
CREATE INDEX `idx_movements_warehouse` ON `inventory_movements` (`warehouse_id`);
CREATE INDEX `idx_movements_created_at` ON `inventory_movements` (`created_at`);

-- ---------------------------------------------------------------------
-- Table 8: suppliers
-- Suppliers master directory with reliability metrics
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `suppliers`;
CREATE TABLE `suppliers` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(150) NOT NULL,
    `code` VARCHAR(50) NOT NULL UNIQUE,
    `contact_person` VARCHAR(100) NULL,
    `email` VARCHAR(120) NOT NULL,
    `phone` VARCHAR(30) NULL,
    `address` VARCHAR(255) NULL,
    `city` VARCHAR(80) NULL,
    `country` VARCHAR(80) DEFAULT 'USA',
    `reliability_score` DECIMAL(5, 2) NOT NULL DEFAULT 85.00,
    `on_time_delivery_rate` DECIMAL(5, 2) NOT NULL DEFAULT 90.00,
    `quality_rating` DECIMAL(3, 2) NOT NULL DEFAULT 4.50,
    `total_orders_completed` INT NOT NULL DEFAULT 0,
    `payment_terms` VARCHAR(60) DEFAULT 'Net 30',
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `chk_reliability_score` CHECK (`reliability_score` BETWEEN 0.00 AND 100.00),
    CONSTRAINT `chk_delivery_rate` CHECK (`on_time_delivery_rate` BETWEEN 0.00 AND 100.00),
    CONSTRAINT `chk_quality_rating` CHECK (`quality_rating` BETWEEN 0.00 AND 5.00)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX `idx_suppliers_code` ON `suppliers` (`code`);
CREATE INDEX `idx_suppliers_reliability` ON `suppliers` (`reliability_score`);

-- ---------------------------------------------------------------------
-- Table 9: supplier_products
-- Mapping products to suppliers with pricing, MOQs and lead times
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `supplier_products`;
CREATE TABLE `supplier_products` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `supplier_id` BIGINT NOT NULL,
    `product_id` BIGINT NOT NULL,
    `supplier_sku` VARCHAR(80) NULL,
    `unit_price` DECIMAL(12, 2) NOT NULL,
    `lead_time_days` INT NOT NULL DEFAULT 7,
    `min_order_quantity` INT NOT NULL DEFAULT 1,
    `is_preferred` BOOLEAN NOT NULL DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_sp_supplier` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_sp_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
    CONSTRAINT `uq_supplier_product` UNIQUE (`supplier_id`, `product_id`),
    CONSTRAINT `chk_sp_price` CHECK (`unit_price` >= 0),
    CONSTRAINT `chk_sp_moq` CHECK (`min_order_quantity` >= 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX `idx_sp_supplier` ON `supplier_products` (`supplier_id`);
CREATE INDEX `idx_sp_product` ON `supplier_products` (`product_id`);

-- ---------------------------------------------------------------------
-- Table 10: sales
-- Sales orders header
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `sales`;
CREATE TABLE `sales` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `sale_order_number` VARCHAR(60) NOT NULL UNIQUE,
    `customer_name` VARCHAR(150) NOT NULL,
    `customer_type` ENUM('RETAIL', 'WHOLESALE', 'COMMERCIAL', 'DISTRIBUTOR') NOT NULL DEFAULT 'RETAIL',
    `warehouse_id` BIGINT NOT NULL,
    `total_amount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `tax_amount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `discount_amount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `final_amount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `payment_status` ENUM('PAID', 'PENDING', 'CANCELLED', 'REFUNDED') NOT NULL DEFAULT 'PAID',
    `payment_method` VARCHAR(50) DEFAULT 'CREDIT_CARD',
    `sale_date` DATE NOT NULL,
    `created_by_user_id` BIGINT NULL,
    `notes` TEXT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_sales_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_sales_user` FOREIGN KEY (`created_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
    CONSTRAINT `chk_sales_amounts` CHECK (`total_amount` >= 0 AND `final_amount` >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX `idx_sales_order_number` ON `sales` (`sale_order_number`);
CREATE INDEX `idx_sales_sale_date` ON `sales` (`sale_date`);
CREATE INDEX `idx_sales_warehouse` ON `sales` (`warehouse_id`);

-- ---------------------------------------------------------------------
-- Table 11: sale_items
-- Sales line items with historical snapshot prices
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `sale_items`;
CREATE TABLE `sale_items` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `sale_id` BIGINT NOT NULL,
    `product_id` BIGINT NOT NULL,
    `quantity` INT NOT NULL,
    `unit_price` DECIMAL(12, 2) NOT NULL,
    `subtotal` DECIMAL(12, 2) NOT NULL,
    `discount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `total_price` DECIMAL(12, 2) NOT NULL,
    CONSTRAINT `fk_sale_items_sale` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_sale_items_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `chk_sale_item_qty` CHECK (`quantity` > 0),
    CONSTRAINT `chk_sale_item_prices` CHECK (`unit_price` >= 0 AND `total_price` >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX `idx_sale_items_sale` ON `sale_items` (`sale_id`);
CREATE INDEX `idx_sale_items_product` ON `sale_items` (`product_id`);

-- ---------------------------------------------------------------------
-- Table 12: purchase_orders
-- Restock purchase orders to suppliers
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `purchase_orders`;
CREATE TABLE `purchase_orders` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `po_number` VARCHAR(60) NOT NULL UNIQUE,
    `supplier_id` BIGINT NOT NULL,
    `warehouse_id` BIGINT NOT NULL,
    `total_amount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `status` ENUM('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'SENT', 'PARTIALLY_RECEIVED', 'RECEIVED', 'CANCELLED') NOT NULL DEFAULT 'DRAFT',
    `expected_delivery_date` DATE NOT NULL,
    `actual_delivery_date` DATE NULL,
    `notes` TEXT NULL,
    `created_by_user_id` BIGINT NULL,
    `approved_by_user_id` BIGINT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_po_supplier` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_po_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_po_created_user` FOREIGN KEY (`created_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_po_approved_user` FOREIGN KEY (`approved_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX `idx_po_number` ON `purchase_orders` (`po_number`);
CREATE INDEX `idx_po_status` ON `purchase_orders` (`status`);
CREATE INDEX `idx_po_supplier` ON `purchase_orders` (`supplier_id`);

-- ---------------------------------------------------------------------
-- Table 13: purchase_order_items
-- Purchase order line items
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `purchase_order_items`;
CREATE TABLE `purchase_order_items` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `purchase_order_id` BIGINT NOT NULL,
    `product_id` BIGINT NOT NULL,
    `ordered_quantity` INT NOT NULL,
    `received_quantity` INT NOT NULL DEFAULT 0,
    `unit_cost` DECIMAL(12, 2) NOT NULL,
    `subtotal_cost` DECIMAL(12, 2) NOT NULL,
    `status` ENUM('PENDING', 'PARTIAL', 'RECEIVED') NOT NULL DEFAULT 'PENDING',
    CONSTRAINT `fk_poi_po` FOREIGN KEY (`purchase_order_id`) REFERENCES `purchase_orders` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_poi_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `chk_poi_quantities` CHECK (`ordered_quantity` > 0 AND `received_quantity` >= 0 AND `received_quantity` <= `ordered_quantity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX `idx_poi_po` ON `purchase_order_items` (`purchase_order_id`);
CREATE INDEX `idx_poi_product` ON `purchase_order_items` (`product_id`);

-- ---------------------------------------------------------------------
-- Table 14: shipments
-- Logistics tracking and transit monitoring
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `shipments`;
CREATE TABLE `shipments` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `tracking_number` VARCHAR(80) NOT NULL UNIQUE,
    `purchase_order_id` BIGINT NOT NULL,
    `carrier_name` VARCHAR(100) NOT NULL,
    `current_status` ENUM('PROCESSING', 'DISPATCHED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'DELAYED', 'CANCELLED') NOT NULL DEFAULT 'PROCESSING',
    `origin_location` VARCHAR(150) NOT NULL,
    `destination_warehouse_id` BIGINT NOT NULL,
    `dispatched_date` TIMESTAMP NULL,
    `estimated_delivery_date` DATE NOT NULL,
    `actual_delivery_date` DATE NULL,
    `delay_risk_level` ENUM('LOW', 'MEDIUM', 'HIGH') NOT NULL DEFAULT 'LOW',
    `delay_risk_score` DECIMAL(4, 2) NOT NULL DEFAULT 0.10,
    `delay_reason` VARCHAR(255) NULL,
    `notes` TEXT NULL,
    `last_updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_shipments_po` FOREIGN KEY (`purchase_order_id`) REFERENCES `purchase_orders` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_shipments_warehouse` FOREIGN KEY (`destination_warehouse_id`) REFERENCES `warehouses` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `chk_delay_score` CHECK (`delay_risk_score` BETWEEN 0.00 AND 1.00)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX `idx_shipments_tracking` ON `shipments` (`tracking_number`);
CREATE INDEX `idx_shipments_status` ON `shipments` (`current_status`);
CREATE INDEX `idx_shipments_po` ON `shipments` (`purchase_order_id`);

-- ---------------------------------------------------------------------
-- Table 15: demand_forecasts
-- ML and baseline demand forecasting predictions
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `demand_forecasts`;
CREATE TABLE `demand_forecasts` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `product_id` BIGINT NOT NULL,
    `forecast_date` DATE NOT NULL,
    `forecast_period_days` INT NOT NULL DEFAULT 30,
    `baseline_predicted_demand` INT NOT NULL,
    `ml_predicted_demand` INT NOT NULL,
    `confidence_lower` INT NULL,
    `confidence_upper` INT NULL,
    `recommended_reorder_qty` INT NOT NULL DEFAULT 0,
    `safety_stock_calculated` INT NOT NULL DEFAULT 0,
    `model_name` VARCHAR(80) NOT NULL DEFAULT 'RandomForestRegressor',
    `model_version` VARCHAR(40) NOT NULL DEFAULT 'v1.0.0',
    `actual_sales` INT NULL,
    `is_demo` BOOLEAN NOT NULL DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_df_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX `idx_df_product` ON `demand_forecasts` (`product_id`);
CREATE INDEX `idx_df_date` ON `demand_forecasts` (`forecast_date`);

-- ---------------------------------------------------------------------
-- Table 16: alerts
-- Real-time notifications and operational warnings
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `alerts`;
CREATE TABLE `alerts` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(150) NOT NULL,
    `message` TEXT NOT NULL,
    `alert_type` ENUM('LOW_STOCK', 'OUT_OF_STOCK', 'RESTOCK_RECOMMENDATION', 'SHIPMENT_DELAY', 'PENDING_APPROVAL', 'SUPPLIER_PERFORMANCE') NOT NULL,
    `severity` ENUM('INFO', 'WARNING', 'CRITICAL') NOT NULL DEFAULT 'INFO',
    `reference_id` VARCHAR(80) NULL,
    `reference_type` VARCHAR(50) NULL,
    `is_read` BOOLEAN NOT NULL DEFAULT FALSE,
    `is_resolved` BOOLEAN NOT NULL DEFAULT FALSE,
    `resolved_at` TIMESTAMP NULL,
    `resolved_by_user_id` BIGINT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_alerts_resolved_user` FOREIGN KEY (`resolved_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX `idx_alerts_type` ON `alerts` (`alert_type`);
CREATE INDEX `idx_alerts_severity` ON `alerts` (`severity`);
CREATE INDEX `idx_alerts_status` ON `alerts` (`is_read`, `is_resolved`);

-- ---------------------------------------------------------------------
-- Table 17: audit_logs
-- System audit trail for compliance and data integrity
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `audit_logs`;
CREATE TABLE `audit_logs` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `entity_name` VARCHAR(80) NOT NULL,
    `entity_id` VARCHAR(80) NOT NULL,
    `action` ENUM('CREATE', 'UPDATE', 'DELETE', 'STATUS_CHANGE', 'RECEIVE') NOT NULL,
    `user_id` BIGINT NULL,
    `details` TEXT NULL,
    `ip_address` VARCHAR(45) NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_audit_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX `idx_audit_entity` ON `audit_logs` (`entity_name`, `entity_id`);
CREATE INDEX `idx_audit_created_at` ON `audit_logs` (`created_at`);

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;
