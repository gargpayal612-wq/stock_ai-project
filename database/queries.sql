-- =====================================================================
-- SupplyStock AI - Operational and Analytical Database Queries
-- Demonstrating High-Performance Queries, Reporting, and Stored Procedures
-- =====================================================================

USE `supplystock_db`;

-- ---------------------------------------------------------------------
-- Query 1: Admin Dashboard KPI Summary
-- Fetches active inventory value, low stock count, out of stock, active shipments
-- ---------------------------------------------------------------------
SELECT 
    COUNT(DISTINCT p.id) AS total_products,
    COUNT(DISTINCT s.id) AS total_suppliers,
    COALESCE(SUM(i.available_stock * p.cost_price), 0) AS total_inventory_cost_value,
    COALESCE(SUM(i.available_stock * p.selling_price), 0) AS total_inventory_retail_value,
    SUM(CASE WHEN i.available_stock <= p.reorder_threshold AND i.available_stock > 0 THEN 1 ELSE 0 END) AS low_stock_items,
    SUM(CASE WHEN i.available_stock = 0 THEN 1 ELSE 0 END) AS out_of_stock_items,
    (SELECT COUNT(*) FROM purchase_orders WHERE status IN ('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'SENT')) AS pending_purchase_orders,
    (SELECT COUNT(*) FROM shipments WHERE current_status IN ('PROCESSING', 'DISPATCHED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY')) AS active_shipments,
    (SELECT COUNT(*) FROM shipments WHERE current_status = 'DELAYED' OR delay_risk_level = 'HIGH') AS delayed_or_high_risk_shipments
FROM products p
LEFT JOIN inventory i ON p.id = i.product_id
LEFT JOIN suppliers s ON s.is_active = TRUE
WHERE p.is_active = TRUE;

-- ---------------------------------------------------------------------
-- Query 2: Smart Restocking Recommendation Query
-- Implements: Recommended Qty = Predicted Demand + Safety Stock - Available - Incoming
-- Filters products that strictly need purchase replenishment
-- ---------------------------------------------------------------------
SELECT 
    p.id AS product_id,
    p.name AS product_name,
    p.sku,
    c.name AS category_name,
    COALESCE(SUM(inv.available_stock), 0) AS total_available_stock,
    COALESCE(SUM(inv.incoming_stock), 0) AS total_incoming_stock,
    p.min_safety_stock,
    p.reorder_threshold,
    COALESCE(df.ml_predicted_demand, p.reorder_threshold * 2) AS predicted_30d_demand,
    GREATEST(
        0, 
        (COALESCE(df.ml_predicted_demand, p.reorder_threshold * 2) + p.min_safety_stock) 
        - COALESCE(SUM(inv.available_stock), 0) 
        - COALESCE(SUM(inv.incoming_stock), 0)
    ) AS calculated_restock_qty,
    sp.unit_price AS preferred_supplier_price,
    sup.name AS preferred_supplier_name,
    sup.id AS preferred_supplier_id,
    sup.reliability_score AS supplier_reliability
FROM products p
JOIN categories c ON p.category_id = c.id
LEFT JOIN inventory inv ON p.id = inv.product_id
LEFT JOIN demand_forecasts df ON p.id = df.product_id 
    AND df.forecast_date = (SELECT MAX(forecast_date) FROM demand_forecasts WHERE product_id = p.id)
LEFT JOIN supplier_products sp ON p.id = sp.product_id AND sp.is_preferred = TRUE
LEFT JOIN suppliers sup ON sp.supplier_id = sup.id
WHERE p.is_active = TRUE
GROUP BY p.id, p.name, p.sku, c.name, p.min_safety_stock, p.reorder_threshold, 
         df.ml_predicted_demand, sp.unit_price, sup.name, sup.id, sup.reliability_score
HAVING calculated_restock_qty > 0 OR total_available_stock <= p.reorder_threshold
ORDER BY calculated_restock_qty DESC;

-- ---------------------------------------------------------------------
-- Query 3: Multi-Warehouse Inventory Distribution & Status
-- ---------------------------------------------------------------------
SELECT 
    p.sku,
    p.name AS product_name,
    w.name AS warehouse_name,
    w.code AS warehouse_code,
    i.available_stock,
    i.reserved_stock,
    i.incoming_stock,
    p.reorder_threshold,
    CASE 
        WHEN i.available_stock = 0 THEN 'OUT_OF_STOCK'
        WHEN i.available_stock <= p.reorder_threshold THEN 'LOW_STOCK'
        WHEN i.available_stock > (p.reorder_threshold * 3) THEN 'OVERSTOCKED'
        ELSE 'HEALTHY'
    END AS stock_status,
    i.last_restocked_at
FROM inventory i
JOIN products p ON i.product_id = p.id
JOIN warehouses w ON i.warehouse_id = w.id
ORDER BY w.name, p.name;

-- ---------------------------------------------------------------------
-- Query 4: Supplier Performance Ranking & Scorecard
-- Evaluates on-time delivery rate, quality rating, and completed volume
-- ---------------------------------------------------------------------
SELECT 
    s.id,
    s.name AS supplier_name,
    s.code,
    s.country,
    s.reliability_score,
    s.on_time_delivery_rate,
    s.quality_rating,
    s.total_orders_completed,
    COUNT(po.id) AS total_system_orders,
    SUM(CASE WHEN po.status = 'RECEIVED' THEN 1 ELSE 0 END) AS fulfilled_orders,
    SUM(CASE WHEN po.actual_delivery_date > po.expected_delivery_date THEN 1 ELSE 0 END) AS delayed_orders,
    ROUND(
        (s.on_time_delivery_rate * 0.40) + 
        ((s.quality_rating / 5.0) * 100 * 0.40) + 
        (LEAST(s.total_orders_completed, 100) * 0.20),
        2
    ) AS calculated_composite_score
FROM suppliers s
LEFT JOIN purchase_orders po ON s.id = po.supplier_id
WHERE s.is_active = TRUE
GROUP BY s.id, s.name, s.code, s.country, s.reliability_score, s.on_time_delivery_rate, s.quality_rating, s.total_orders_completed
ORDER BY calculated_composite_score DESC;

-- ---------------------------------------------------------------------
-- Query 5: Product Velocity Analysis (Fast vs Slow Moving Items)
-- Identifies best sellers in past 30 days
-- ---------------------------------------------------------------------
SELECT 
    p.id,
    p.sku,
    p.name AS product_name,
    c.name AS category_name,
    COALESCE(SUM(si.quantity), 0) AS total_units_sold,
    COALESCE(SUM(si.total_price), 0) AS total_revenue_generated,
    COALESCE(SUM(inv.available_stock), 0) AS current_stock,
    CASE 
        WHEN COALESCE(SUM(si.quantity), 0) >= 150 THEN 'FAST_MOVING'
        WHEN COALESCE(SUM(si.quantity), 0) >= 50 THEN 'MODERATE'
        ELSE 'SLOW_MOVING'
    END AS velocity_tier
FROM products p
JOIN categories c ON p.category_id = c.id
LEFT JOIN sale_items si ON p.id = si.product_id
LEFT JOIN sales s ON si.sale_id = s.id AND s.sale_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
LEFT JOIN inventory inv ON p.id = inv.product_id
WHERE p.is_active = TRUE
GROUP BY p.id, p.sku, p.name, c.name
ORDER BY total_units_sold DESC;

-- ---------------------------------------------------------------------
-- Query 6: Active Shipments with Predictive Delay Risk
-- ---------------------------------------------------------------------
SELECT 
    sh.id,
    sh.tracking_number,
    sh.carrier_name,
    sh.current_status,
    sh.origin_location,
    w.name AS destination_warehouse,
    po.po_number,
    sup.name AS supplier_name,
    sh.estimated_delivery_date,
    sh.delay_risk_level,
    sh.delay_risk_score,
    sh.delay_reason,
    DATEDIFF(CURDATE(), sh.estimated_delivery_date) AS days_overdue
FROM shipments sh
JOIN purchase_orders po ON sh.purchase_order_id = po.id
JOIN suppliers sup ON po.supplier_id = sup.id
JOIN warehouses w ON sh.destination_warehouse_id = w.id
WHERE sh.current_status NOT IN ('DELIVERED', 'CANCELLED')
ORDER BY sh.delay_risk_score DESC, sh.estimated_delivery_date ASC;

-- ---------------------------------------------------------------------
-- Query 7: Complete Inventory Movement Audit Trail for a Specific Product
-- ---------------------------------------------------------------------
SELECT 
    im.id,
    p.sku,
    p.name AS product_name,
    w.code AS warehouse_code,
    im.movement_type,
    im.quantity,
    im.previous_stock,
    im.new_stock,
    im.reference_id,
    im.reference_type,
    im.notes,
    u.full_name AS performed_by,
    im.created_at
FROM inventory_movements im
JOIN products p ON im.product_id = p.id
JOIN warehouses w ON im.warehouse_id = w.id
LEFT JOIN users u ON im.created_by_user_id = u.id
ORDER BY im.created_at DESC
LIMIT 50;
