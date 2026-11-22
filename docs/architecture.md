# SupplyStock AI — System Architecture Specification

## 1. High-Level Architecture Overview

SupplyStock AI is structured as a decoupled, multi-tier enterprise platform comprising:
1. **Frontend Tier (Client)**: React.js Single Page Application (SPA) with responsive layout, real-time analytics with Recharts, role-based route guards, and toast notification state.
2. **Backend API Gateway & Core Business Tier**: Java Spring Boot 3 microservice layer managing transactional integrity, Spring Security with JWT tokens, Spring Data JPA persistence, and multi-warehouse stock reconciliation.
3. **AI / Machine Learning Service Tier**: Python FastAPI microservice operating Scikit-learn demand forecasting models, shipment delay risk classifiers, safety stock optimizers, and a secure Google Gemini proxy.
4. **Relational Database Tier**: MySQL 8.0+ transactional database with strict referential constraints, indexing, and immutable audit ledgers.

```
+-------------------------------------------------------------------------------+
|                             CLIENT / FRONTEND                                 |
|                       React.js + Tailwind CSS + Recharts                      |
|                  Roles: Admin, Retailer, Wholesaler, Supplier, etc.           |
+-------------------------------------------------------------------------------+
                                      |
                           HTTPS / REST (JSON + JWT)
                                      v
+-------------------------------------------------------------------------------+
|                         BACKEND SERVICE (JAVA SPRING BOOT)                    |
|  +-------------------------------------------------------------------------+  |
|  | Controller Layer  (REST Endpoints, Validation, DTO Serialization)       |  |
|  +-------------------------------------------------------------------------+  |
|  | Security Layer    (Spring Security 6, JWT Filter, RBAC Role Matrix)     |  |
|  +-------------------------------------------------------------------------+  |
|  | Service Layer     (Transactional Business Rules, Restock Formulas)      |  |
|  +-------------------------------------------------------------------------+  |
|  | Repository Layer  (Spring Data JPA, Hibernate, Custom Queries)          |  |
|  +-------------------------------------------------------------------------+  |
+-------------------------------------------------------------------------------+
           |                                                 |
      JDBC / TCP                                     REST / JSON HTTP
           v                                                 v
+-----------------------+                         +-----------------------------+
| DATABASE (MYSQL 8.0+) |                         |  AI / ML SERVICE (FASTAPI)  |
| - 17 Relational Tables|                         |  - Scikit-learn Models      |
| - InnoDB ACID Engine  |                         |  - Feature Engineering      |
| - Immutable Ledgers   |                         |  - Restock Calculator       |
| - Multi-warehouse     |                         |  - Gemini AI Assistant Proxy|
+-----------------------+                         +-----------------------------+
```

## 2. Separation of Responsibilities in AI/ML

To ensure compliance with engineering standards:
- **Numerical ML & Time-Series Models (Scikit-learn)**:
  - Demand Forecasting: Trained on historical transaction frequencies, seasonal lags, and rolling averages (`RandomForestRegressor`, `GradientBoostingRegressor`, compared against baseline rolling averages).
  - Delay-Risk Classification: Logistic Regression / Random Forest predicting transit disruptions based on carrier, route distance, weather risk flags, and supplier reliability.
- **Conversational AI (Google Gemini API)**:
  - Provides natural language business assistance, executive summaries, and plain-English explanations of data insights.
  - Receives pre-filtered, authorized application context from the backend.
  - Does NOT invent fictitious numerical predictions or execute raw SQL.

## 3. Role-Based Access Control (RBAC) Matrix

| Module / Operation | Admin | Retailer | Wholesaler | Supplier | Manufacturer | Delivery Partner |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| Admin Dashboard & Metrics | Full | Read-Only | Read-Only | None | None | None |
| Product Catalog CRUD | Full | Read/Update | Read | Read | Read | None |
| Record Sales Transactions | Full | Full | Full | None | None | None |
| Create Purchase Orders | Full | Full | Full | None | Full | None |
| Approve Purchase Orders | Full | None | None | None | None | None |
| Fulfill & Update PO Status | Full | None | None | Full | Full | None |
| Shipment Status & Tracking | Full | Read | Read | Read/Update | Read/Update | Full |
| AI Demand Forecasting | Full | Full | Full | Read | Read | None |
| AI Conversational Assistant | Full | Full | Full | Full | Full | Full |
