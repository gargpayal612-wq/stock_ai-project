-- =====================================================================
-- SupplyStock AI - Comprehensive Realistic Sample Data
-- For Immediate Testing and Demonstration
-- =====================================================================

USE `supplystock_db`;

SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------------------
-- 1. Roles
-- ---------------------------------------------------------------------
INSERT INTO `roles` (`id`, `name`, `description`) VALUES
(1, 'ADMIN', 'System Administrator with full access across all operations and configuration'),
(2, 'RETAILER', 'Retail merchant managing store inventory, sales, and purchase replenishment'),
(3, 'WHOLESALER', 'Bulk distributor managing large volume sales and warehouse operations'),
(4, 'SUPPLIER', 'Vendor fulfilling purchase orders, updating catalog, and confirming shipments'),
(5, 'MANUFACTURER', 'Production and assembly partner managing raw material supply and batch runs'),
(6, 'DELIVERY_PARTNER', 'Logistics carrier managing dispatch, shipment tracking, and delivery confirmations')
ON DUPLICATE KEY UPDATE `description` = VALUES(`description`);

-- ---------------------------------------------------------------------
-- 2. Users (BCrypt hashed passwords for 'Password@123': $2a$10$wTf2zD6Vekn2L9xUv7qQkOGUuA7z9q5Y8gA4Yx8eJ4uF4t0eY2e6a)
-- ---------------------------------------------------------------------
INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `full_name`, `phone`, `role_id`, `company_name`, `is_active`) VALUES
(1, 'admin', 'admin@supplystock.ai', '$2a$10$wTf2zD6Vekn2L9xUv7qQkOGUuA7z9q5Y8gA4Yx8eJ4uF4t0eY2e6a', 'Sarah Jenkins', '+1 (312) 555-0100', 1, 'SupplyStock Global HQ', TRUE),
(2, 'retailer_dan', 'retailer@supplystock.ai', '$2a$10$wTf2zD6Vekn2L9xUv7qQkOGUuA7z9q5Y8gA4Yx8eJ4uF4t0eY2e6a', 'Dan Reynolds', '+1 (312) 555-0101', 2, 'Metro Retail Electronics', TRUE),
(3, 'wholesaler_maya', 'wholesaler@supplystock.ai', '$2a$10$wTf2zD6Vekn2L9xUv7qQkOGUuA7z9q5Y8gA4Yx8eJ4uF4t0eY2e6a', 'Maya Patel', '+1 (213) 555-0102', 3, 'Apex Wholesale Distribution', TRUE),
(4, 'supplier_ken', 'supplier@supplystock.ai', '$2a$10$wTf2zD6Vekn2L9xUv7qQkOGUuA7z9q5Y8gA4Yx8eJ4uF4t0eY2e6a', 'Kenji Takahashi', '+1 (408) 555-0103', 4, 'Nippon Micro Semi Co.', TRUE),
(5, 'mfg_elena', 'manufacturer@supplystock.ai', '$2a$10$wTf2zD6Vekn2L9xUv7qQkOGUuA7z9q5Y8gA4Yx8eJ4uF4t0eY2e6a', 'Elena Rostova', '+1 (713) 555-0104', 5, 'Vanguard Precision Assembly', TRUE),
(6, 'carrier_marcus', 'delivery@supplystock.ai', '$2a$10$wTf2zD6Vekn2L9xUv7qQkOGUuA7z9q5Y8gA4Yx8eJ4uF4t0eY2e6a', 'Marcus Vance', '+1 (201) 555-0105', 6, 'SwiftLogistics Express', TRUE)
ON DUPLICATE KEY UPDATE `full_name` = VALUES(`full_name`);

-- ---------------------------------------------------------------------
-- 3. Categories
-- ---------------------------------------------------------------------
INSERT INTO `categories` (`id`, `name`, `code`, `description`) VALUES
(1, 'Electronics & Semiconductors', 'ELEC-SEMI', 'Microcontrollers, integrated circuits, sensors and power management components'),
(2, 'Industrial Hardware & Fasteners', 'IND-HARD', 'Structural steel fasteners, bearings, fittings, and industrial grade hardware'),
(3, 'Consumer Electronics & Gadgets', 'CONS-ELEC', 'Consumer packaged electronics, audio gear, cables, smart accessories'),
(4, 'Packaging & Shipping Supplies', 'PACK-SHIP', 'Corrugated boxes, thermal labels, bubble wrap, industrial strapping'),
(5, 'Automotive & Robotics Sensors', 'AUTO-SENS', 'LiDAR modules, ultrasonic distance sensors, CAN-bus automotive interfaces')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- ---------------------------------------------------------------------
-- 4. Products
-- ---------------------------------------------------------------------
INSERT INTO `products` (`id`, `name`, `sku`, `category_id`, `description`, `cost_price`, `selling_price`, `unit`, `reorder_threshold`, `min_safety_stock`, `lead_time_days`) VALUES
(1, 'Cortex-M4 32-Bit Microcontroller IC', 'ELEC-MCU-001', 1, 'ARM Cortex-M4 RISC core, 512KB Flash, 64-pin LQFP packaging', 4.50, 9.80, 'units', 150, 50, 10),
(2, 'Precision Environmental Temp/Humidity Sensor', 'ELEC-SENS-002', 1, 'Digital I2C output, +/-0.2C temp accuracy, low power consumption', 2.80, 6.50, 'units', 200, 75, 7),
(3, 'Ultra-Low ESR 100uF Solid Polymer Capacitor', 'ELEC-CAP-003', 1, '16V surface mount, ultra-low ESR 15mOhm, automotive qualified', 0.45, 1.25, 'units', 500, 200, 5),
(4, 'High-Efficiency DC-DC Step Down Converter', 'ELEC-PWR-004', 1, 'Wide input 4.5V-36V, 3A output, 95% peak efficiency sync buck', 1.85, 4.20, 'units', 180, 60, 8),
(5, 'Grade 8.8 Galvanized Hex Bolt M8x50mm', 'IND-BLT-101', 2, 'High tensile steel bolt, zinc electroplated, metric pitch 1.25mm', 0.25, 0.75, 'boxes (100)', 80, 30, 4),
(6, 'Deep Groove Sealed Ball Bearing 608-2RS', 'IND-BRG-102', 2, 'Carbon steel bearing, dual rubber seals, pre-lubricated with synthetic grease', 1.20, 3.10, 'units', 120, 40, 6),
(7, 'Pneumatic Quick-Connect Push Fitting 6mm', 'IND-FIT-103', 2, 'Brass nickel-plated body, POM release sleeve, 150 PSI rated', 0.85, 2.40, 'packs (10)', 100, 35, 5),
(8, 'Active Noise-Cancelling Bluetooth Earbuds', 'CONS-AUD-201', 3, 'Hybrid ANC, 40-hour total battery life, Bluetooth 5.3, IPX5', 22.00, 59.99, 'units', 60, 20, 14),
(9, 'Braided 100W USB-C Fast Charging Cable 2m', 'CONS-CBL-202', 3, 'E-Marker chip, Kevlar reinforced core, 480Mbps data sync', 3.10, 12.99, 'units', 250, 80, 7),
(10, 'MagSafe 15W Qi2 Fast Wireless Charger', 'CONS-WCH-203', 3, 'Aluminum alloy chassis, braided 1.5m cord, thermal protection', 8.50, 24.99, 'units', 90, 30, 10),
(11, 'Double-Wall Corrugated Box 16x12x12 Inch', 'PACK-BOX-301', 4, '200 lb burst test rated heavy duty shipping carton, ECT-32 certified', 1.10, 2.85, 'bundles (25)', 150, 50, 3),
(12, 'Direct Thermal Barcode Shipping Labels 4x6"', 'PACK-LBL-302', 4, 'BPA-free top-coated thermal labels, perforated fanfold 500/stack', 4.50, 11.50, 'stacks', 120, 45, 4),
(13, 'Industrial Stretch Film Wrap 18" x 1500ft', 'PACK-STW-303', 4, '80 Gauge puncture-resistant cast stretch wrap for palletizing', 9.20, 19.80, 'rolls', 70, 25, 4),
(14, 'Solid-State LiDAR Mini Distance Scanner 12m', 'AUTO-LID-401', 5, 'Time-of-flight optical measurement, 100Hz sample rate, UART/I2C', 38.00, 89.00, 'units', 40, 15, 18),
(15, 'Isolated High-Speed CAN FD Transceiver', 'AUTO-CAN-402', 5, 'ISO 11898-2:2016 compliant, 5Mbps, galvanic 5kV isolation', 2.90, 7.20, 'units', 140, 45, 12)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- ---------------------------------------------------------------------
-- 5. Warehouses
-- ---------------------------------------------------------------------
INSERT INTO `warehouses` (`id`, `name`, `code`, `location`, `capacity_sqft`, `manager_name`, `contact_phone`, `is_active`) VALUES
(1, 'Central Midwest Mega Fulfillment Hub', 'WH-CHI-01', '4500 Logistics Blvd, Joliet, IL 60431', 250000, 'Michael Chang', '+1 (815) 555-0210', TRUE),
(2, 'West Coast Gateway Distribution Center', 'WH-LAX-02', '1280 Harbor Scenic Way, Long Beach, CA 90802', 180000, 'Brenda Morales', '+1 (562) 555-0220', TRUE),
(3, 'East Coast Port Logistics Warehouse', 'WH-EWR-03', '77 Distribution Way, Newark, NJ 07114', 160000, 'Anthony Russo', '+1 (973) 555-0230', TRUE),
(4, 'Southern Regional Cross-Dock Depot', 'WH-DFW-04', '3100 Air Cargo Rd, Fort Worth, TX 76155', 140000, 'Samantha Hayes', '+1 (817) 555-0240', TRUE)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- ---------------------------------------------------------------------
-- 6. Inventory (Intentionally includes: Healthy, Low Stock, and Out of Stock)
-- ---------------------------------------------------------------------
INSERT INTO `inventory` (`id`, `product_id`, `warehouse_id`, `available_stock`, `reserved_stock`, `incoming_stock`, `last_restocked_at`) VALUES
-- Product 1: Cortex-M4 (Threshold 150) -> LOW STOCK in WH1 (85), Out in WH2 (0)
(1, 1, 1, 85, 15, 100, DATE_SUB(NOW(), INTERVAL 12 DAY)),
(2, 1, 2, 0, 0, 150, DATE_SUB(NOW(), INTERVAL 30 DAY)),
-- Product 2: Temp Sensor (Threshold 200) -> HEALTHY in WH1 (310), WH2 (180)
(3, 2, 1, 310, 20, 0, DATE_SUB(NOW(), INTERVAL 4 DAY)),
(4, 2, 2, 180, 10, 50, DATE_SUB(NOW(), INTERVAL 8 DAY)),
-- Product 3: Capacitor (Threshold 500) -> HEALTHY (1200)
(5, 3, 1, 1200, 100, 500, DATE_SUB(NOW(), INTERVAL 6 DAY)),
-- Product 4: DC-DC Step Down (Threshold 180) -> LOW STOCK (90)
(6, 4, 1, 90, 25, 120, DATE_SUB(NOW(), INTERVAL 14 DAY)),
-- Product 5: Hex Bolts (Threshold 80) -> HEALTHY (140)
(7, 5, 1, 140, 10, 0, DATE_SUB(NOW(), INTERVAL 15 DAY)),
(8, 5, 4, 95, 5, 40, DATE_SUB(NOW(), INTERVAL 7 DAY)),
-- Product 6: Ball Bearing (Threshold 120) -> CRITICAL LOW (35)
(9, 6, 1, 35, 10, 100, DATE_SUB(NOW(), INTERVAL 20 DAY)),
-- Product 7: Push Fitting (Threshold 100) -> HEALTHY (160)
(10, 7, 1, 160, 15, 0, DATE_SUB(NOW(), INTERVAL 5 DAY)),
-- Product 8: ANC Earbuds (Threshold 60) -> CRITICAL LOW (18)
(11, 8, 1, 18, 12, 50, DATE_SUB(NOW(), INTERVAL 18 DAY)),
(12, 8, 3, 22, 5, 30, DATE_SUB(NOW(), INTERVAL 16 DAY)),
-- Product 9: USB-C Cable (Threshold 250) -> HEALTHY (450)
(13, 9, 1, 450, 30, 0, DATE_SUB(NOW(), INTERVAL 3 DAY)),
(14, 9, 2, 320, 20, 100, DATE_SUB(NOW(), INTERVAL 6 DAY)),
-- Product 10: MagSafe Charger (Threshold 90) -> LOW STOCK (42)
(15, 10, 1, 42, 8, 60, DATE_SUB(NOW(), INTERVAL 11 DAY)),
-- Product 11: Corrugated Box (Threshold 150) -> HEALTHY (380)
(16, 11, 1, 380, 40, 200, DATE_SUB(NOW(), INTERVAL 2 DAY)),
(17, 11, 4, 210, 20, 0, DATE_SUB(NOW(), INTERVAL 9 DAY)),
-- Product 12: Shipping Labels (Threshold 120) -> LOW STOCK (55)
(18, 12, 1, 55, 15, 80, DATE_SUB(NOW(), INTERVAL 13 DAY)),
-- Product 13: Stretch Film (Threshold 70) -> OUT OF STOCK (0)
(19, 13, 1, 0, 0, 75, DATE_SUB(NOW(), INTERVAL 25 DAY)),
-- Product 14: Mini LiDAR (Threshold 40) -> CRITICAL LOW (8)
(20, 14, 1, 8, 4, 30, DATE_SUB(NOW(), INTERVAL 22 DAY)),
-- Product 15: CAN FD Transceiver (Threshold 140) -> HEALTHY (210)
(21, 15, 1, 210, 20, 0, DATE_SUB(NOW(), INTERVAL 4 DAY))
ON DUPLICATE KEY UPDATE `available_stock` = VALUES(`available_stock`);

-- ---------------------------------------------------------------------
-- 7. Suppliers
-- ---------------------------------------------------------------------
INSERT INTO `suppliers` (`id`, `name`, `code`, `contact_person`, `email`, `phone`, `address`, `city`, `country`, `reliability_score`, `on_time_delivery_rate`, `quality_rating`, `total_orders_completed`, `payment_terms`) VALUES
(1, 'Nippon Micro Silicon Tech', 'SUP-NIP-01', 'Kenji Takahashi', 'orders@nippon-micro.jp', '+81 3-5555-0199', '2-1-1 Marunouchi, Chiyoda-ku', 'Tokyo', 'Japan', 96.50, 97.20, 4.90, 84, 'Net 30'),
(2, 'Shenzhen Apex Sensor Corp', 'SUP-SHZ-02', 'Li Wei', 'supply@apexsensor.cn', '+86 755-8888-2100', 'Bldg 4, High-Tech Industrial Park', 'Shenzhen', 'China', 89.20, 87.50, 4.60, 62, 'Net 45'),
(3, 'Midwest Precision Fasteners Ltd', 'SUP-MWP-03', 'Robert Miller', 'sales@midwestfasteners.com', '+1 (330) 555-4300', '1400 Industrial Pkwy', 'Cleveland', 'USA', 94.80, 95.00, 4.85, 115, 'Net 30'),
(4, 'Aura Audio Acoustics Inc', 'SUP-AUR-04', 'Jennifer Beale', 'b2b@aura-acoustics.com', '+1 (408) 555-8910', '890 Silicon Blvd', 'San Jose', 'USA', 82.40, 80.00, 4.30, 39, 'Net 30'),
(5, 'OmniPack Global Solutions', 'SUP-OMN-05', 'Carlos Mendez', 'orders@omnipackglobal.com', '+1 (214) 555-7720', '500 Cargo Way', 'Dallas', 'USA', 98.10, 99.00, 4.95, 142, 'Net 15'),
(6, 'OptiNav Autonomous Sensors', 'SUP-OPT-06', 'Dr. Hans Gruber', 'procure@optinav-tech.de', '+49 89-555-3210', 'Technologiepark 12', 'Munich', 'Germany', 76.50, 71.00, 4.40, 28, 'Net 60')
ON DUPLICATE KEY UPDATE `reliability_score` = VALUES(`reliability_score`);

-- ---------------------------------------------------------------------
-- 8. Supplier Products
-- ---------------------------------------------------------------------
INSERT INTO `supplier_products` (`id`, `supplier_id`, `product_id`, `supplier_sku`, `unit_price`, `lead_time_days`, `min_order_quantity`, `is_preferred`) VALUES
-- Nippon Micro: MCU & CAN Transceiver
(1, 1, 1, 'NM-C4-LQFP64', 4.40, 10, 50, TRUE),
(2, 1, 15, 'NM-CANFD-ISO', 2.85, 8, 50, TRUE),
-- Shenzhen Apex: Temp Sensor & DC-DC Converter & Capacitor
(3, 2, 2, 'SZ-TH-02DIG', 2.65, 7, 100, TRUE),
(4, 2, 3, 'SZ-CAP-100U', 0.42, 5, 250, TRUE),
(5, 2, 4, 'SZ-DCDC-3A', 1.78, 8, 80, TRUE),
-- Midwest Fasteners: Bolts, Bearings, Fittings
(6, 3, 5, 'MW-HEX-88-M8', 0.23, 4, 20, TRUE),
(7, 3, 6, 'MW-608-2RS-IND', 1.15, 6, 50, TRUE),
(8, 3, 7, 'MW-QC-6MM-BRS', 0.80, 5, 30, TRUE),
-- Aura Audio: Earbuds, Cables, Wireless Chargers
(9, 4, 8, 'AUR-NC-BT53', 21.50, 14, 25, TRUE),
(10, 4, 9, 'AUR-USBC-100W', 2.95, 7, 100, TRUE),
(11, 4, 10, 'AUR-MAG-15W', 8.20, 10, 40, TRUE),
-- OmniPack: Boxes, Labels, Stretch Wrap
(12, 5, 11, 'OMN-DW-1612', 1.05, 3, 50, TRUE),
(13, 5, 12, 'OMN-TH-4X6-500', 4.30, 4, 30, TRUE),
(14, 5, 13, 'OMN-STW-80G', 8.90, 4, 20, TRUE),
-- OptiNav: Mini LiDAR
(15, 6, 14, 'OPT-TOF-12M', 37.50, 18, 10, TRUE),
-- Secondary supplier alternative for comparison demo:
(16, 2, 1, 'SZ-ALT-MCU4', 4.65, 12, 100, FALSE)
ON DUPLICATE KEY UPDATE `unit_price` = VALUES(`unit_price`);

-- ---------------------------------------------------------------------
-- 9. Sales
-- ---------------------------------------------------------------------
INSERT INTO `sales` (`id`, `sale_order_number`, `customer_name`, `customer_type`, `warehouse_id`, `total_amount`, `tax_amount`, `discount_amount`, `final_amount`, `payment_status`, `payment_method`, `sale_date`, `created_by_user_id`) VALUES
(1, 'SO-2026-001', 'AeroDrone Dynamics LLC', 'COMMERCIAL', 1, 3840.00, 268.80, 100.00, 4008.80, 'PAID', 'WIRE_TRANSFER', DATE_SUB(CURDATE(), INTERVAL 14 DAY), 2),
(2, 'SO-2026-002', 'NextGen Robotics Lab', 'COMMERCIAL', 1, 2185.00, 152.95, 0.00, 2337.95, 'PAID', 'CREDIT_CARD', DATE_SUB(CURDATE(), INTERVAL 11 DAY), 2),
(3, 'SO-2026-003', 'Prime Electronics Retailers', 'WHOLESALE', 2, 4920.00, 344.40, 250.00, 5014.40, 'PAID', 'ACH', DATE_SUB(CURDATE(), INTERVAL 8 DAY), 3),
(4, 'SO-2026-004', 'Apex Industrial MRO', 'COMMERCIAL', 1, 1450.00, 101.50, 50.00, 1501.50, 'PAID', 'CREDIT_CARD', DATE_SUB(CURDATE(), INTERVAL 6 DAY), 2),
(5, 'SO-2026-005', 'Silicon Valley Hardware Store', 'RETAIL', 2, 875.00, 61.25, 0.00, 936.25, 'PAID', 'CREDIT_CARD', DATE_SUB(CURDATE(), INTERVAL 3 DAY), 2),
(6, 'SO-2026-006', 'Global Logistics Fulfillment Corp', 'COMMERCIAL', 4, 3210.00, 224.70, 100.00, 3334.70, 'PAID', 'WIRE_TRANSFER', DATE_SUB(CURDATE(), INTERVAL 1 DAY), 3),
(7, 'SO-2026-007', 'TechInnovate Systems Inc', 'COMMERCIAL', 1, 1780.00, 124.60, 0.00, 1904.60, 'PAID', 'CREDIT_CARD', CURDATE(), 2)
ON DUPLICATE KEY UPDATE `final_amount` = VALUES(`final_amount`);

-- ---------------------------------------------------------------------
-- 10. Sale Items
-- ---------------------------------------------------------------------
INSERT INTO `sale_items` (`id`, `sale_id`, `product_id`, `quantity`, `unit_price`, `subtotal`, `discount`, `total_price`) VALUES
-- SO-1: 30x Mini LiDAR, 60x MCU
(1, 1, 14, 30, 89.00, 2670.00, 0.00, 2670.00),
(2, 1, 1, 120, 9.80, 1176.00, 6.00, 1170.00),
-- SO-2: 200x Temp Sensors, 150x DC-DC
(3, 2, 2, 200, 6.50, 1300.00, 0.00, 1300.00),
(4, 2, 4, 210, 4.20, 882.00, 0.00, 882.00),
-- SO-3: 60x Earbuds, 100x USB-C cables
(5, 3, 8, 60, 59.99, 3599.40, 200.00, 3399.40),
(6, 3, 9, 120, 12.99, 1558.80, 50.00, 1508.80),
-- SO-4: Fasteners, Bearings, Fittings
(7, 4, 5, 50, 0.75, 37.50, 0.00, 37.50),
(8, 4, 6, 200, 3.10, 620.00, 20.00, 600.00),
(9, 4, 7, 330, 2.40, 792.00, 30.00, 762.00),
-- SO-5: Chargers & Cables
(10, 5, 10, 25, 24.99, 624.75, 0.00, 624.75),
(11, 5, 9, 20, 12.99, 259.80, 9.55, 250.25),
-- SO-6: Packaging supplies
(12, 6, 11, 500, 2.85, 1425.00, 50.00, 1375.00),
(13, 6, 12, 100, 11.50, 1150.00, 30.00, 1120.00),
(14, 6, 13, 35, 19.80, 693.00, 20.00, 673.00),
-- SO-7: 150x CAN FD, 80x Temp Sensors
(15, 7, 15, 150, 7.20, 1080.00, 0.00, 1080.00),
(16, 7, 2, 100, 6.50, 650.00, 0.00, 650.00)
ON DUPLICATE KEY UPDATE `total_price` = VALUES(`total_price`);

-- ---------------------------------------------------------------------
-- 11. Purchase Orders
-- ---------------------------------------------------------------------
INSERT INTO `purchase_orders` (`id`, `po_number`, `supplier_id`, `warehouse_id`, `total_amount`, `status`, `expected_delivery_date`, `actual_delivery_date`, `notes`, `created_by_user_id`, `approved_by_user_id`) VALUES
(1, 'PO-2026-001', 1, 1, 1250.00, 'RECEIVED', DATE_SUB(CURDATE(), INTERVAL 20 DAY), DATE_SUB(CURDATE(), INTERVAL 19 DAY), 'Routine MCU restock - Arrived on schedule', 2, 1),
(2, 'PO-2026-002', 2, 1, 850.00, 'RECEIVED', DATE_SUB(CURDATE(), INTERVAL 15 DAY), DATE_SUB(CURDATE(), INTERVAL 14 DAY), 'Capacitors and sensors batch replenishment', 2, 1),
(3, 'PO-2026-003', 3, 1, 460.00, 'RECEIVED', DATE_SUB(CURDATE(), INTERVAL 10 DAY), DATE_SUB(CURDATE(), INTERVAL 10 DAY), 'Industrial hardware restock', 3, 1),
(4, 'PO-2026-004', 6, 1, 1875.00, 'SENT', DATE_SUB(CURDATE(), INTERVAL 2 DAY), NULL, 'URGENT: Mini LiDAR sensors - supplier shipment delayed at customs', 2, 1),
(5, 'PO-2026-005', 4, 1, 1490.00, 'PARTIALLY_RECEIVED', DATE_ADD(CURDATE(), INTERVAL 2 DAY), NULL, 'Audio and charging accessories replenishment', 2, 1),
(6, 'PO-2026-006', 1, 1, 880.00, 'APPROVED', DATE_ADD(CURDATE(), INTERVAL 5 DAY), NULL, 'Approved replenishment for Cortex-M4 and CAN-FD', 2, 1),
(7, 'PO-2026-007', 5, 1, 1200.00, 'PENDING_APPROVAL', DATE_ADD(CURDATE(), INTERVAL 4 DAY), NULL, 'Packaging materials bulk restock awaiting CFO sign-off', 3, NULL),
(8, 'PO-2026-008', 2, 2, 720.00, 'DRAFT', DATE_ADD(CURDATE(), INTERVAL 8 DAY), NULL, 'Draft reorder for West Coast warehouse', 2, NULL)
ON DUPLICATE KEY UPDATE `status` = VALUES(`status`);

-- ---------------------------------------------------------------------
-- 12. Purchase Order Items
-- ---------------------------------------------------------------------
INSERT INTO `purchase_order_items` (`id`, `purchase_order_id`, `product_id`, `ordered_quantity`, `received_quantity`, `unit_cost`, `subtotal_cost`, `status`) VALUES
-- PO-1
(1, 1, 1, 200, 200, 4.40, 880.00, 'RECEIVED'),
(2, 1, 15, 130, 130, 2.85, 370.50, 'RECEIVED'),
-- PO-2
(3, 2, 2, 200, 200, 2.65, 530.00, 'RECEIVED'),
(4, 2, 3, 760, 760, 0.42, 319.20, 'RECEIVED'),
-- PO-3
(5, 3, 5, 50, 50, 0.23, 11.50, 'RECEIVED'),
(6, 3, 6, 200, 200, 1.15, 230.00, 'RECEIVED'),
(7, 3, 7, 270, 270, 0.80, 216.00, 'RECEIVED'),
-- PO-4 (Urgent LiDAR)
(8, 4, 14, 50, 0, 37.50, 1875.00, 'PENDING'),
-- PO-5 (Aura Earbuds & Chargers)
(9, 5, 8, 50, 30, 21.50, 1075.00, 'PARTIAL'),
(10, 5, 10, 50, 20, 8.20, 410.00, 'PARTIAL'),
-- PO-6
(11, 6, 1, 150, 0, 4.40, 660.00, 'PENDING'),
(12, 6, 15, 77, 0, 2.85, 219.45, 'PENDING'),
-- PO-7
(13, 7, 11, 400, 0, 1.05, 420.00, 'PENDING'),
(14, 7, 12, 100, 0, 4.30, 430.00, 'PENDING'),
(15, 7, 13, 40, 0, 8.90, 356.00, 'PENDING')
ON DUPLICATE KEY UPDATE `received_quantity` = VALUES(`received_quantity`);

-- ---------------------------------------------------------------------
-- 13. Shipments
-- ---------------------------------------------------------------------
INSERT INTO `shipments` (`id`, `tracking_number`, `purchase_order_id`, `carrier_name`, `current_status`, `origin_location`, `destination_warehouse_id`, `dispatched_date`, `estimated_delivery_date`, `actual_delivery_date`, `delay_risk_level`, `delay_risk_score`, `delay_reason`, `notes`) VALUES
(1, 'TRK-NIP-9021', 1, 'SwiftLogistics Express', 'DELIVERED', 'Tokyo Port, Japan', 1, DATE_SUB(NOW(), INTERVAL 24 DAY), DATE_SUB(CURDATE(), INTERVAL 20 DAY), DATE_SUB(CURDATE(), INTERVAL 19 DAY), 'LOW', 0.05, NULL, 'Completed without incidents'),
(2, 'TRK-SHZ-8104', 2, 'Pacific Express Freight', 'DELIVERED', 'Shenzhen, China', 1, DATE_SUB(NOW(), INTERVAL 18 DAY), DATE_SUB(CURDATE(), INTERVAL 15 DAY), DATE_SUB(CURDATE(), INTERVAL 14 DAY), 'LOW', 0.08, NULL, 'Air cargo arrived smoothly'),
(3, 'TRK-MWP-7722', 3, 'FedEx National Ground', 'DELIVERED', 'Cleveland, OH', 1, DATE_SUB(NOW(), INTERVAL 12 DAY), DATE_SUB(CURDATE(), INTERVAL 10 DAY), DATE_SUB(CURDATE(), INTERVAL 10 DAY), 'LOW', 0.02, NULL, 'Domestic ground on-time'),
(4, 'TRK-OPT-4419', 4, 'Global TransAir Express', 'DELAYED', 'Munich, Germany', 1, DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_SUB(CURDATE(), INTERVAL 2 DAY), NULL, 'HIGH', 0.88, 'Severe port congestion and customs clearance inspection hold', 'Urgent action required: Contact customs broker'),
(5, 'TRK-AUR-6320', 5, 'BlueDart Freight Systems', 'IN_TRANSIT', 'San Jose, CA', 1, DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_ADD(CURDATE(), INTERVAL 2 DAY), NULL, 'MEDIUM', 0.42, 'Weather advisory near Denver junction', 'Partial delivery already processed, remainder in transit'),
(6, 'TRK-NIP-9402', 6, 'SwiftLogistics Express', 'PROCESSING', 'Tokyo, Japan', 1, NOW(), DATE_ADD(CURDATE(), INTERVAL 5 DAY), NULL, 'LOW', 0.15, NULL, 'Order approved, supplier preparing export documents')
ON DUPLICATE KEY UPDATE `current_status` = VALUES(`current_status`);

-- ---------------------------------------------------------------------
-- 14. Demand Forecasts (Demonstrating ML vs Baseline and Restock Formula)
-- Recommended = Predicted Demand + Safety Stock - Available Stock - Incoming Stock
-- ---------------------------------------------------------------------
INSERT INTO `demand_forecasts` (`id`, `product_id`, `forecast_date`, `forecast_period_days`, `baseline_predicted_demand`, `ml_predicted_demand`, `confidence_lower`, `confidence_upper`, `recommended_reorder_qty`, `safety_stock_calculated`, `model_name`, `model_version`, `is_demo`) VALUES
-- Product 1: Cortex-M4 (Avail: 85, Incoming: 100, ML: 320, Safety: 50) -> Rec = 320 + 50 - 85 - 100 = 185
(1, 1, CURDATE(), 30, 260, 320, 290, 350, 185, 50, 'RandomForestRegressor', 'v1.2.0', FALSE),
-- Product 2: Temp Sensor (Avail: 490, Incoming: 50, ML: 380, Safety: 75) -> Rec = 380 + 75 - 490 - 50 = 0 (Surplus)
(2, 2, CURDATE(), 30, 350, 380, 340, 420, 0, 75, 'RandomForestRegressor', 'v1.2.0', FALSE),
-- Product 4: DC-DC Step Down (Avail: 90, Incoming: 120, ML: 280, Safety: 60) -> Rec = 280 + 60 - 90 - 120 = 130
(3, 4, CURDATE(), 30, 240, 280, 250, 310, 130, 60, 'RandomForestRegressor', 'v1.2.0', FALSE),
-- Product 6: Ball Bearing (Avail: 35, Incoming: 100, ML: 220, Safety: 40) -> Rec = 220 + 40 - 35 - 100 = 125
(4, 6, CURDATE(), 30, 190, 220, 195, 245, 125, 40, 'GradientBoostingRegressor', 'v1.2.0', FALSE),
-- Product 8: ANC Earbuds (Avail: 40, Incoming: 80, ML: 180, Safety: 20) -> Rec = 180 + 20 - 40 - 80 = 80
(5, 8, CURDATE(), 30, 150, 180, 160, 200, 80, 20, 'RandomForestRegressor', 'v1.2.0', FALSE),
-- Product 10: MagSafe Charger (Avail: 42, Incoming: 60, ML: 150, Safety: 30) -> Rec = 150 + 30 - 42 - 60 = 78
(6, 10, CURDATE(), 30, 130, 150, 135, 165, 78, 30, 'RandomForestRegressor', 'v1.2.0', FALSE),
-- Product 12: Shipping Labels (Avail: 55, Incoming: 80, ML: 210, Safety: 45) -> Rec = 210 + 45 - 55 - 80 = 120
(7, 12, CURDATE(), 30, 180, 210, 190, 230, 120, 45, 'RandomForestRegressor', 'v1.2.0', FALSE),
-- Product 13: Stretch Film (Avail: 0, Incoming: 75, ML: 140, Safety: 25) -> Rec = 140 + 25 - 0 - 75 = 90
(8, 13, CURDATE(), 30, 120, 140, 125, 155, 90, 25, 'LinearRegression', 'v1.0.0', TRUE),
-- Product 14: Mini LiDAR (Avail: 8, Incoming: 30, ML: 75, Safety: 15) -> Rec = 75 + 15 - 8 - 30 = 52
(9, 14, CURDATE(), 30, 60, 75, 65, 85, 52, 15, 'RandomForestRegressor', 'v1.2.0', FALSE)
ON DUPLICATE KEY UPDATE `ml_predicted_demand` = VALUES(`ml_predicted_demand`);

-- ---------------------------------------------------------------------
-- 15. Inventory Movements (Ledger)
-- ---------------------------------------------------------------------
INSERT INTO `inventory_movements` (`id`, `product_id`, `warehouse_id`, `movement_type`, `quantity`, `previous_stock`, `new_stock`, `reference_id`, `reference_type`, `notes`, `created_by_user_id`) VALUES
(1, 1, 1, 'PO_RECEIPT', 200, 0, 200, 'PO-2026-001', 'PURCHASE_ORDER', 'Initial batch receipt from Nippon Micro', 1),
(2, 1, 1, 'SALE', -115, 200, 85, 'SO-2026-001', 'SALE_ORDER', 'Order fulfillment for AeroDrone Dynamics', 2),
(3, 2, 1, 'PO_RECEIPT', 400, 110, 510, 'PO-2026-002', 'PURCHASE_ORDER', 'Received batch from Shenzhen Apex', 1),
(4, 2, 1, 'SALE', -200, 510, 310, 'SO-2026-002', 'SALE_ORDER', 'Order fulfillment for NextGen Robotics', 2),
(5, 8, 1, 'SALE', -60, 78, 18, 'SO-2026-003', 'SALE_ORDER', 'Prime Electronics retail distributor order', 3),
(6, 13, 1, 'SALE', -35, 35, 0, 'SO-2026-006', 'SALE_ORDER', 'Global Logistics packaging supplies shipment - Depleted all stock', 3),
(7, 14, 1, 'SALE', -30, 38, 8, 'SO-2026-001', 'SALE_ORDER', 'AeroDrone sensor integration shipment - Critical low trigger', 2)
ON DUPLICATE KEY UPDATE `new_stock` = VALUES(`new_stock`);

-- ---------------------------------------------------------------------
-- 16. Alerts
-- ---------------------------------------------------------------------
INSERT INTO `alerts` (`id`, `title`, `message`, `alert_type`, `severity`, `reference_id`, `reference_type`, `is_read`, `is_resolved`) VALUES
(1, 'Critical Out of Stock: Industrial Stretch Film', 'Industrial Stretch Film Wrap (PACK-STW-303) has 0 available units at Central Midwest Hub. Current backlog risk is high.', 'OUT_OF_STOCK', 'CRITICAL', 'PACK-STW-303', 'PRODUCT', FALSE, FALSE),
(2, 'Stock Threshold Breach: Mini LiDAR Distance Scanner', 'Mini LiDAR Scanner (AUTO-LID-401) is down to 8 units (Threshold: 40, Safety Stock: 15). Incoming shipment TRK-OPT-4419 is delayed.', 'LOW_STOCK', 'CRITICAL', 'AUTO-LID-401', 'PRODUCT', FALSE, FALSE),
(3, 'Shipment Delayed: Munich Import TRK-OPT-4419', 'Shipment TRK-OPT-4419 (PO-2026-004) from OptiNav Autonomous Sensors is delayed by 48+ hours due to customs clearance hold. Predicted delay risk: 88%.', 'SHIPMENT_DELAY', 'WARNING', 'TRK-OPT-4419', 'SHIPMENT', FALSE, FALSE),
(4, 'AI Restock Recommendation: Cortex-M4 Microcontroller', 'AI Forecasting recommends ordering 185 units of Cortex-M4 (ELEC-MCU-001) to satisfy projected 30-day demand and safety buffer.', 'RESTOCK_RECOMMENDATION', 'INFO', 'ELEC-MCU-001', 'PRODUCT', FALSE, FALSE),
(5, 'Pending Purchase Order Approval: PO-2026-007', 'Purchase Order PO-2026-007 totaling $1,200.00 for OmniPack Global Solutions requires administrator approval.', 'PENDING_APPROVAL', 'WARNING', 'PO-2026-007', 'PURCHASE_ORDER', FALSE, FALSE),
(6, 'Low Stock Alert: Active Noise-Cancelling Earbuds', 'ANC Bluetooth Earbuds (CONS-AUD-201) available stock at 18 units in Central Midwest Hub. Lead time is 14 days.', 'LOW_STOCK', 'WARNING', 'CONS-AUD-201', 'PRODUCT', TRUE, FALSE),
(7, 'Supplier Reliability Warning: OptiNav Autonomous Sensors', 'OptiNav reliability score dropped to 76.5% following repeated international shipment delays (On-time delivery: 71.0%).', 'SUPPLIER_PERFORMANCE', 'WARNING', 'SUP-OPT-06', 'SUPPLIER', FALSE, FALSE),
(8, 'Low Stock Alert: MagSafe 15W Wireless Charger', 'MagSafe Charger (CONS-WCH-203) available stock at 42 units (Threshold: 90). Restock recommendation: 78 units.', 'LOW_STOCK', 'INFO', 'CONS-WCH-203', 'PRODUCT', TRUE, TRUE)
ON DUPLICATE KEY UPDATE `message` = VALUES(`message`);

SET FOREIGN_KEY_CHECKS = 1;
