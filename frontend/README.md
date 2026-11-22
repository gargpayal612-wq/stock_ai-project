# SupplyStock AI — Modern React Frontend

## Technology Stack
- **React.js 18** Single Page Application
- **Vite** Build tool & dev server
- **Tailwind CSS 3** for enterprise SaaS UI styling
- **Recharts** for interactive time-series, area, bar, and donut charts
- **Lucide React** for icons
- **React Router 6** for protected and role-guarded navigation

## Quickstart

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Run Vite Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

## Built-In Features
- **1-Click Evaluator Personas**: In the top Navbar role pill or on the Login page, switch instantly between 6 enterprise personas (**Admin**, **Retailer**, **Wholesaler**, **Supplier**, **Manufacturer**, **Delivery Partner**) without needing to create new accounts.
- **Interactive Restock Calculator**: Test the restocking equation:
  $$\text{Recommended Purchase Quantity} = \max(0, \text{Predicted Demand} + \text{Safety Stock} - \text{Available Stock} - \text{Expected Incoming})$$
- **Live Spring Boot & Zero-Dependency Fallback**: Seamlessly connects to Spring Boot REST endpoints on `http://localhost:8080/api/v1` while also retaining an in-memory fallback layer so all buttons, forms, and charts remain 100% interactive even if the backend is not yet started!
