# SupplyStock AI — Entity Relationship (ER) Diagram & Schema Specification

## 1. Relational ER Diagram

```mermaid
erDiagram
    ROLES ||--o{ USERS : "assigned to"
    USERS ||--o{ SALES : "creates"
    USERS ||--o{ PURCHASE_ORDERS : "creates / approves"
    USERS ||--o{ INVENTORY_MOVEMENTS : "records"
    USERS ||--o{ ALERTS : "resolves"

    CATEGORIES ||--o{ PRODUCTS : "classifies"
    PRODUCTS ||--o{ INVENTORY : "stocked in"
    WAREHOUSES ||--o{ INVENTORY : "holds"

    PRODUCTS ||--o{ INVENTORY_MOVEMENTS : "audits"
    WAREHOUSES ||--o{ INVENTORY_MOVEMENTS : "tracks"

    SUPPLIERS ||--o{ SUPPLIER_PRODUCTS : "supplies"
    PRODUCTS ||--o{ SUPPLIER_PRODUCTS : "supplied by"

    SALES ||--|{ SALE_ITEMS : "contains"
    PRODUCTS ||--o{ SALE_ITEMS : "sold in"
    WAREHOUSES ||--o{ SALES : "fulfilled from"

    SUPPLIERS ||--o{ PURCHASE_ORDERS : "receives"
    WAREHOUSES ||--o{ PURCHASE_ORDERS : "destination"
    PURCHASE_ORDERS ||--|{ PURCHASE_ORDER_ITEMS : "contains"
    PRODUCTS ||--o{ PURCHASE_ORDER_ITEMS : "ordered item"

    PURCHASE_ORDERS ||--o{ SHIPMENTS : "generates"
    WAREHOUSES ||--o{ SHIPMENTS : "delivers to"

    PRODUCTS ||--o{ DEMAND_FORECASTS : "analyzed for"

    ROLES {
        bigint id PK
        varchar name UK
        varchar description
    }

    USERS {
        bigint id PK
        varchar username UK
        varchar email UK
        varchar password_hash
        varchar full_name
        bigint role_id FK
        varchar company_name
        boolean is_active
    }

    CATEGORIES {
        bigint id PK
        varchar name UK
        varchar code UK
        text description
    }

    PRODUCTS {
        bigint id PK
        varchar name
        varchar sku UK
        bigint category_id FK
        decimal cost_price
        decimal selling_price
        varchar unit
        int reorder_threshold
        int min_safety_stock
        int lead_time_days
        boolean is_active
    }

    WAREHOUSES {
        bigint id PK
        varchar name
        varchar code UK
        varchar location
        int capacity_sqft
        varchar manager_name
        boolean is_active
    }

    INVENTORY {
        bigint id PK
        bigint product_id FK
        bigint warehouse_id FK
        int available_stock
        int reserved_stock
        int incoming_stock
        timestamp last_restocked_at
    }

    INVENTORY_MOVEMENTS {
        bigint id PK
        bigint product_id FK
        bigint warehouse_id FK
        enum movement_type
        int quantity
        int previous_stock
        int new_stock
        varchar reference_id
        varchar reference_type
    }

    SUPPLIERS {
        bigint id PK
        varchar name
        varchar code UK
        varchar contact_person
        varchar email
        varchar phone
        decimal reliability_score
        decimal on_time_delivery_rate
        decimal quality_rating
        int total_orders_completed
    }

    SUPPLIER_PRODUCTS {
        bigint id PK
        bigint supplier_id FK
        bigint product_id FK
        decimal unit_price
        int lead_time_days
        int min_order_quantity
        boolean is_preferred
    }

    SALES {
        bigint id PK
        varchar sale_order_number UK
        varchar customer_name
        enum customer_type
        bigint warehouse_id FK
        decimal total_amount
        decimal tax_amount
        decimal final_amount
        enum payment_status
        date sale_date
    }

    SALE_ITEMS {
        bigint id PK
        bigint sale_id FK
        bigint product_id FK
        int quantity
        decimal unit_price
        decimal subtotal
        decimal discount
        decimal total_price
    }

    PURCHASE_ORDERS {
        bigint id PK
        varchar po_number UK
        bigint supplier_id FK
        bigint warehouse_id FK
        decimal total_amount
        enum status
        date expected_delivery_date
        date actual_delivery_date
    }

    PURCHASE_ORDER_ITEMS {
        bigint id PK
        bigint purchase_order_id FK
        bigint product_id FK
        int ordered_quantity
        int received_quantity
        decimal unit_cost
        decimal subtotal_cost
        enum status
    }

    SHIPMENTS {
        bigint id PK
        varchar tracking_number UK
        bigint purchase_order_id FK
        varchar carrier_name
        enum current_status
        varchar origin_location
        bigint destination_warehouse_id FK
        date estimated_delivery_date
        enum delay_risk_level
        decimal delay_risk_score
    }

    DEMAND_FORECASTS {
        bigint id PK
        bigint product_id FK
        date forecast_date
        int forecast_period_days
        int baseline_predicted_demand
        int ml_predicted_demand
        int recommended_reorder_qty
        int safety_stock_calculated
        varchar model_name
    }

    ALERTS {
        bigint id PK
        varchar title
        text message
        enum alert_type
        enum severity
        varchar reference_id
        boolean is_read
        boolean is_resolved
    }
```

## 2. Database Normalization Analysis
- **First Normal Form (1NF)**: Every column holds atomic values. No repeating groups. Each table has a defined primary key (`id`).
- **Second Normal Form (2NF)**: All non-key attributes are fully functionally dependent on the primary key. In intersection entities (`inventory`, `supplier_products`, `sale_items`), attributes depend strictly on the composite or surrogate key.
- **Third Normal Form (3NF)**: Transitive dependencies are removed. Customer and category details are decoupled into distinct relation tables; historical transactional prices are frozen in items tables to prevent dynamic catalog price drift.
