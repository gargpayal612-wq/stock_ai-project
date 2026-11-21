# SupplyStock AI
### Intelligent Inventory & Supply Chain Management System
**Tagline: Predict Smart. Stock Smart. Deliver Smarter.**

---

## 1. Executive Summary & Problem Solved

Traditional supply chains suffer from systemic vulnerabilities:
- **Overstocking & High Carrying Costs**: Unscientific bulk ordering ties up working capital in depreciating or expiring stock.
- **Stock Shortages & Lost Sales**: Inability to anticipate sudden demand spikes causes stockouts on high-margin products.
- **Unreliable Suppliers**: Lack of data-driven vendor scorecards leads to unexpected production stalls.
- **Transit Bottlenecks & Customs Holds**: Shipments encounter delayed milestones with zero prior warning.
- **Disconnected Decisions**: Manual spreadsheets and siloed ERPs create friction between retailers, wholesalers, and suppliers.

**SupplyStock AI** resolves these challenges through an end-to-end, multi-tier enterprise platform integrating real-time inventory control, Scikit-learn demand forecasting, vendor reliability scorecards, automated purchase order generation, and conversational business intelligence.

---

## 2. Technology Stack

| Layer | Technologies | Responsibilities |
| :--- | :--- | :--- |
| **Frontend** | React.js 18, Vite, Tailwind CSS 3, Recharts, Lucide Icons, React Router 6 | Responsive SaaS dashboards, real-time analytics charts, interactive restock calculator, role-based workflows |
| **Backend** | Java 17+, Spring Boot 3.2, Spring Web, Spring Data JPA, Spring Security 6, Maven | RESTful API gateway, stateless JWT authentication, atomic stock movement transactions, business logic |
| **Database** | MySQL 8.0+ (with standalone H2 in-memory profile support) | 17 normalized relational tables (1NF, 2NF, 3NF), foreign keys, immutable audit ledgers |
| **AI / ML Layer**| Python 3.10+, FastAPI, Scikit-learn, Pandas, NumPy, Google Gemini API | Time-series demand forecasting (`RandomForestRegressor`), logistic delay-risk classifier, conversational assistant |

---

## 3. System Architecture & Communication

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

### Strict Separation of AI Responsibilities
- **Scikit-Learn Machine Learning**: Handles numerical demand forecasting, lag feature regressions, and logistic delay-risk scoring based on statistical training data.
- **Google Gemini API**: Provides natural-language business explanations, executive summaries, and Q&A assistance using authorized application context.
- **Security Protocols**: Backend API keys are never exposed to the frontend; no raw SQL execution is allowed from AI prompts; and model training is clearly decoupled from generative responses.

---

## 4. Repository Structure

```
SupplyStock-AI/
├── frontend/                     # React.js 18 + Vite + Tailwind CSS Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/           # StatsCard, StatusBadge, Modal, Toast
│   │   │   └── layout/           # Navbar with role quick-switch, Sidebar
│   │   ├── context/              # AuthContext with 6 role personas
│   │   ├── pages/                # 14 Full Enterprise Pages
│   │   │   ├── LandingPage.jsx   # Marketing hero & interactive restock demo
│   │   │   ├── LoginPage.jsx     # 1-click role logins & JWT authentication
│   │   │   ├── RegisterPage.jsx  # New organization signup
│   │   │   ├── DashboardPage.jsx # KPI grid, Recharts revenue & stock charts
│   │   │   ├── InventoryPage.jsx # Multi-warehouse stock master & audit logs
│   │   │   ├── ProductDetailsPage.jsx # SKU margin, warehouse allocation
│   │   │   ├── SalesPage.jsx     # Multi-item order cart & atomic stock deduction
│   │   │   ├── SuppliersPage.jsx # Vendor reliability scorecards & catalog
│   │   │   ├── PurchaseOrdersPage.jsx # Restock recommendations & PO workflow
│   │   │   ├── DemandForecastingPage.jsx # Random Forest vs Baseline SMA charts
│   │   │   ├── ShipmentsPage.jsx # Multimodal tracking & milestone updates
│   │   │   ├── DelayRiskPage.jsx # Risk prediction matrix & simulator
│   │   │   ├── AlertsPage.jsx    # Operational notifications & resolutions
│   │   │   ├── AIAssistantPage.jsx # Conversational Gemini business assistant
│   │   │   └── ProfilePage.jsx   # User details & RBAC permission matrix
│   │   ├── services/
│   │   │   └── api.js            # Unified API client with live & fallback modes
│   │   ├── App.jsx               # React Router routes
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/                      # Java Spring Boot 3 Core Backend
│   ├── src/main/java/com/supplystock/
│   │   ├── config/               # WebConfig, RestTemplateConfig
│   │   ├── controller/           # 11 REST Controllers
│   │   ├── dto/                  # Request / Response DTOs
│   │   ├── entity/               # 16 Relational JPA Entities
│   │   ├── repository/           # 16 Spring Data Repositories
│   │   ├── security/             # Spring Security, JWT Filter, UserDetails
│   │   ├── service/              # 12 Transactional Services & Data Seeder
│   │   └── SupplyStockApplication.java
│   ├── src/main/resources/
│   │   ├── application.properties    # MySQL profile
│   │   └── application-h2.properties # In-memory H2 standalone profile
│   └── pom.xml
│
├── ai-service/                   # Python FastAPI Machine Learning Microservice
│   ├── app/
│   │   ├── services/
│   │   │   ├── forecasting_service.py # Scikit-Learn RandomForest demand pipeline
│   │   │   ├── risk_service.py        # Logistics delay-risk classifier
│   │   │   └── gemini_service.py      # Google Gemini proxy & context engine
│   │   └── schemas.py            # Pydantic request / response schemas
│   ├── main.py                   # FastAPI routing & CORS
│   └── requirements.txt
│
├── database/                     # MySQL Relational Database Layer
│   ├── schema.sql                # 17 Tables with foreign keys & constraints
│   ├── sample_data.sql           # Comprehensive realistic seed data
│   ├── queries.sql               # Analytical & operational SQL queries
│   └── README.md
│
├── docs/                         # Comprehensive Engineering Documentation
│   ├── architecture.md           # System design, data flow, RBAC matrix
│   ├── er-diagram.md             # Mermaid entity-relationship diagram
│   └── api-documentation.md      # OpenAPI REST endpoint specifications
│
├── .env.example
├── .gitignore
└── README.md
```

---

## 5. Core Business Logic & The Restocking Formula

The system computes recommended purchase replenishment orders using the mathematical formula:

$$\text{Recommended Purchase Quantity} = \max(0, \text{Predicted Demand} + \text{Safety Stock} - \text{Available Stock} - \text{Expected Incoming Stock})$$

- **Predicted Demand**: Projected sales demand over the forecast horizon (7, 14, or 30 days) computed by the Scikit-learn `RandomForestRegressor`.
- **Safety Stock**: Minimum buffer stock allocated to absorb delivery lead time variance.
- **Available Stock**: Current physically available stock across destination warehouses.
- **Expected Incoming Stock**: Quantity already in transit under approved purchase orders.
- **Constraint**: Clamped to $\ge 0$ to strictly prevent negative purchase order generation.

---

## 6. Pre-Seeded Evaluation Accounts

Each account is pre-configured with the default password: **`Password@123`**

| Persona | Email | Role | Scope of Access |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin@supplystock.ai` | `ADMIN` | Complete configuration, approvals, and executive valuation |
| **Retail Merchant** | `retailer@supplystock.ai` | `RETAILER` | Store inventory, POS sales, and PO replenishment |
| **Wholesale Distributor**| `wholesaler@supplystock.ai` | `WHOLESALER` | Bulk sales, regional depots, cross-warehouse transfers |
| **Product Supplier** | `supplier@supplystock.ai` | `SUPPLIER` | PO fulfillment, shipment creation, pricing catalog |
| **Assembly Manufacturer**| `manufacturer@supplystock.ai`| `MANUFACTURER`| Raw material procurement and production runs |
| **Delivery Carrier** | `delivery@supplystock.ai` | `DELIVERY_PARTNER` | Carrier tracking, milestone check-ins, transit exceptions |

*Tip: You can also switch between any of these personas with 1 click using the role selector pill in the top navigation bar.*

---

## 7. Step-by-Step Launch Instructions

### Option A: Running the Frontend (Instant Standalone Demo Mode)
The frontend contains an intelligent API service with live Spring Boot connectivity and a zero-dependency local fallback, allowing you to test all 14 pages and workflows immediately:
```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Launch Vite server
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

### Option B: Running the Java Spring Boot Backend
```bash
# 1. Navigate to backend
cd backend

# 2. Run with standard MySQL profile:
mvn spring-boot:run

# OR run with zero-setup in-memory H2 profile:
mvn spring-boot:run -Dspring-boot.run.profiles=h2
```
The backend initializes on **`http://localhost:8080/api/v1`**. On first boot, `DataInitializerService` will automatically seed default roles, users, categories, products, suppliers, inventory, and alerts if the database is empty.

---

### Option C: Running the Python AI / ML Service
```bash
# 1. Navigate to AI service
cd ai-service

# 2. Create virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# 3. Install requirements
pip install -r requirements.txt

# 4. Start FastAPI server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
API Documentation (Swagger UI): **`http://localhost:8000/docs`**

---

### Option D: Initializing MySQL Database Directly
```bash
# Connect to your MySQL 8.0 instance
mysql -u root -p

# Execute creation and population scripts
source database/schema.sql;
source database/sample_data.sql;
```

---

## 8. Verification & Testing Guide
1. **Explore Landing Page (`/`)**: Test the interactive restock calculator with custom values.
2. **Sign In (`/login`)**: Use the 1-click evaluator role buttons to log in as Retailer or Admin.
3. **Admin Dashboard (`/dashboard`)**: Verify live KPI metrics, 7-day revenue trend chart, and stock category distribution.
4. **Inventory Control (`/inventory`)**: Search products, filter by category or warehouse, add a new product, adjust stock quantities, and view the immutable movement ledger.
5. **Record a Sale (`/sales`)**: Create a new customer sale order; verify that stock decreases atomically and sales exceeding available stock are rejected.
6. **Smart Restocking (`/purchase-orders`)**: Review recommendations calculated by the formula and issue a purchase order with 1 click.
7. **AI Demand Forecasting (`/forecasting`)**: Run Scikit-learn Random Forest forecasting over 7, 14, and 30-day horizons and compare with the baseline moving average.
8. **Shipment Tracking (`/shipments`)**: Update milestone statuses and inspect delay-risk levels.
9. **Predictive Delay-Risk Simulator (`/delay-risk`)**: Adjust sliders for supplier reliability and route distance to see real-time probability shifts.
10. **Gemini AI Assistant (`/ai-assistant`)**: Ask questions such as *"Which products are running low on stock?"* or *"What should I reorder this week?"* and review the verified data citations.
#   s t o c k _ a i - p r o j e c t  
 