# SupplyStock AI — Database Architecture & Setup Guide

## 1. Overview
The **SupplyStock AI** relational database is engineered for high throughput, data integrity, and strict normalization (1NF, 2NF, 3NF). It powers enterprise supply chain orchestration, multi-warehouse inventory control, transactional sales order processing, supplier performance scoring, and predictive demand restocking.

## 2. Entity Relationship Overview
The database comprises 17 tables structured across 6 core functional domains:

```
+------------------------------------------------------------------------------------+
|                                 CORE DOMAINS                                       |
+-------------------+--------------------+-------------------+-----------------------+
| 1. AUTH & ROLES   | 2. PRODUCT MASTER  | 3. INVENTORY & WH | 4. PURCHASING & SUPPLY|
| - roles           | - categories       | - warehouses      | - suppliers           |
| - users           | - products         | - inventory       | - supplier_products   |
|                   |                    | - movements       | - purchase_orders     |
|                   |                    |                   | - purchase_order_items|
+-------------------+--------------------+-------------------+-----------------------+
| 5. SALES & ORDERS | 6. LOGISTICS & AI  | 7. SYSTEM AUDIT   |                       |
| - sales           | - shipments        | - alerts          |                       |
| - sale_items      | - demand_forecasts | - audit_logs      |                       |
+-------------------+--------------------+-------------------+-----------------------+
```

## 3. Database Setup Instructions

### Prerequisites
- MySQL 8.0 or higher
- MySQL Workbench or MySQL CLI client

### Quick Setup Commands
```bash
# Connect to MySQL Server
mysql -u root -p

# Execute Schema Creation
source database/schema.sql;

# Populate Comprehensive Sample Data
source database/sample_data.sql;

# Verify Sample Queries
source database/queries.sql;
```

Or execute directly from the terminal / command line:
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/sample_data.sql
```

## 4. Key Business Logic Enforced in Database
1. **Referential Integrity**: Foreign key constraints strictly prevent orphaned inventory or broken sales records (`ON DELETE RESTRICT` on vital catalog items).
2. **Atomic Stock Movements**: `inventory_movements` provides an immutable double-entry ledger tracking all adjustments (`IN`, `OUT`, `SALE`, `PO_RECEIPT`, `RETURN`).
3. **Smart Restocking Formula**:
   $$\text{Recommended Purchase Quantity} = \max(0, \text{Predicted Demand} + \text{Safety Stock} - \text{Available Stock} - \text{Incoming Stock})$$
4. **Historical Price Preservation**: `sale_items` and `purchase_order_items` capture the exact unit price at transaction time, unaffected by future product catalog price adjustments.
5. **No Negative Stock Constraints**: `CHECK` constraints on `available_stock >= 0`, `cost_price >= 0`, and `quantity > 0` prevent data anomalies.

## 5. Default User Accounts (Pre-seeded with BCrypt Password: `Password@123`)
| Username | Email | Role | Scope |
| :--- | :--- | :--- | :--- |
| `admin` | `admin@supplystock.ai` | **ADMIN** | Full administrative and configuration control |
| `retailer_dan` | `retailer@supplystock.ai` | **RETAILER** | Store inventory, POS sales, and replenishment |
| `wholesaler_maya` | `wholesaler@supplystock.ai` | **WHOLESALE** | Bulk sales orders and multi-warehouse supply |
| `supplier_ken` | `supplier@supplystock.ai` | **SUPPLIER** | PO fulfillment, shipments, and pricing catalog |
| `mfg_elena` | `manufacturer@supplystock.ai`| **MANUFACTURER** | Assembly batches and components supply |
| `carrier_marcus`| `delivery@supplystock.ai` | **DELIVERY** | Carrier tracking, dispatches, and delivery status |
