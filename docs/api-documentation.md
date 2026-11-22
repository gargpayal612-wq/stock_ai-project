# SupplyStock AI — REST API Documentation

Base URLs:
- Spring Boot Core Backend: `http://localhost:8080/api/v1`
- Python AI / ML Microservice: `http://localhost:8000/api/v1`

---

## 1. Authentication Endpoints (`/api/v1/auth`)

### `POST /auth/login`
Authenticates a user and issues a signed JWT token.
- **Request Body**:
```json
{
  "email": "retailer@supplystock.ai",
  "password": "Password@123"
}
```
- **Response `200 OK`**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "user": {
    "id": 2,
    "username": "retailer_dan",
    "email": "retailer@supplystock.ai",
    "fullName": "Dan Reynolds",
    "role": "RETAILER",
    "companyName": "Metro Retail Electronics"
  }
}
```

### `POST /auth/register`
Creates a new account.
- **Request Body**:
```json
{
  "username": "new_merchant",
  "email": "merchant@store.com",
  "password": "SecurePassword@123",
  "fullName": "Alice Johnson",
  "role": "RETAILER",
  "companyName": "Tech Hub Retail",
  "phone": "+1 555-0199"
}
```

---

## 2. Dashboard Analytics (`/api/v1/dashboard`)

### `GET /dashboard/summary`
Returns high-level KPI cards and aggregated metrics.
- **Response `200 OK`**:
```json
{
  "totalProducts": 15,
  "totalSuppliers": 6,
  "totalInventoryCostValue": 48250.75,
  "totalInventoryRetailValue": 104320.00,
  "lowStockCount": 5,
  "outOfStockCount": 1,
  "pendingPurchaseOrders": 3,
  "activeShipments": 3,
  "delayedShipments": 1,
  "salesTrend30Days": [
    { "date": "2026-11-01", "revenue": 3840.0, "unitsSold": 150 }
  ],
  "stockCategoryDistribution": [
    { "category": "Electronics & Semiconductors", "itemCount": 4, "totalStock": 1675 }
  ]
}
```

---

## 3. Inventory Management (`/api/v1/inventory`)

### `GET /inventory`
Query inventory across all products and warehouses.
- **Query Params**: `categoryId`, `warehouseId`, `search`, `lowStockOnly`
- **Response `200 OK`**: Array of product stock items with thresholds and status badges.

### `POST /inventory/products`
Creates a new product catalog entry.
- **Request Body**:
```json
{
  "name": "ESP32-S3 Dual-Core WiFi/BLE SoC",
  "sku": "ELEC-WIFI-005",
  "categoryId": 1,
  "description": "240MHz Xtensa 32-bit LX7, 512KB SRAM",
  "costPrice": 2.20,
  "sellingPrice": 5.50,
  "unit": "units",
  "reorderThreshold": 120,
  "minSafetyStock": 40,
  "leadTimeDays": 8
}
```

### `GET /inventory/movements`
Fetches stock movement ledger records for tracking and auditing.

---

## 4. Sales Management (`/api/v1/sales`)

### `POST /sales`
Records a customer sale and automatically decrements inventory within a database transaction.
- **Request Body**:
```json
{
  "customerName": "Cascade Industrial Automation",
  "customerType": "COMMERCIAL",
  "warehouseId": 1,
  "paymentMethod": "CREDIT_CARD",
  "items": [
    { "productId": 1, "quantity": 10, "unitPrice": 9.80 },
    { "productId": 2, "quantity": 25, "unitPrice": 6.50 }
  ],
  "discountAmount": 10.00,
  "notes": "Net 30 invoice order"
}
```
- **Validation**: Rejects transaction with HTTP `400 Bad Request` if requested quantity exceeds available warehouse stock.

---

## 5. Purchase Orders & Restocking (`/api/v1/purchase-orders`)

### `GET /purchase-orders/recommendations`
Calculates automated restocking quantities using the ML prediction formula:
`Recommended Qty = Predicted Demand + Safety Stock - Available - Incoming`

### `POST /purchase-orders`
Creates a new purchase order to a designated supplier.

### `PATCH /purchase-orders/{id}/status`
Updates PO workflow state: `APPROVED`, `SENT`, `PARTIALLY_RECEIVED`, `RECEIVED`, `CANCELLED`.
Receiving a PO automatically generates an `IN` stock movement and increments available stock.

---

## 6. Shipments & Delay Tracking (`/api/v1/shipments`)

### `GET /shipments`
Lists all active shipments with carrier, status, and delay risk score.

### `POST /shipments/{id}/update-status`
Updates shipment milestones (`DISPATCHED`, `IN_TRANSIT`, `DELIVERED`, `DELAYED`).

---

## 7. AI & Machine Learning Services (`/api/v1/ai`)

### `POST /ai/forecast`
Invokes the Python Scikit-learn demand forecasting pipeline.
- **Request Body**:
```json
{
  "productId": 1,
  "horizonDays": 30
}
```
- **Response**:
```json
{
  "productId": 1,
  "productName": "Cortex-M4 32-Bit Microcontroller IC",
  "historicalAverageSales": 260,
  "baselineForecast": 260,
  "mlForecast": 320,
  "lowerBound": 290,
  "upperBound": 350,
  "safetyStock": 50,
  "availableStock": 85,
  "incomingStock": 100,
  "recommendedPurchaseQty": 185,
  "modelUsed": "RandomForestRegressor (v1.2.0)"
}
```

### `POST /ai/assistant/chat`
Conversational assistant query using authorized live application metrics.
- **Request Body**:
```json
{
  "prompt": "Which products should I reorder this week and why?",
  "role": "RETAILER"
}
```
- **Response**:
```json
{
  "reply": "Based on current stock levels and 30-day demand predictions, here are the top 2 products requiring immediate restocking:\n\n1. **Cortex-M4 Microcontroller (ELEC-MCU-001)**: Available stock is 85 units with 100 incoming, but projected demand is 320 units with a safety buffer of 50. Recommended reorder: **185 units**.\n2. **Mini LiDAR Scanner (AUTO-LID-401)**: Available stock is critically low at 8 units against a threshold of 40. Recommended reorder: **52 units**.",
  "dataSources": ["products", "inventory", "demand_forecasts"],
  "modelType": "Gemini-1.5 / SupplyStock Context Engine"
}
```
