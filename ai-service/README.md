# SupplyStock AI — Python AI / ML Service

This microservice handles:
1. **Demand Forecasting**: Scikit-learn `RandomForestRegressor` and lag feature engineering, predicting demand over 7, 14, and 30-day horizons.
2. **Smart Restocking**: Computes exact recommended purchase quantities:
   $$\text{Recommended Qty} = \max(0, \text{Predicted Demand} + \text{Safety Stock} - \text{Available Stock} - \text{Incoming Stock})$$
3. **Logistics Delay-Risk Classification**: Scikit-learn calibrated classifier evaluating route distance, customs clearance, supplier reliability, and adverse weather risks.
4. **Gemini AI Conversational Assistant**: Google Gemini 1.5 proxy with authorized database context injection and transparent fallback engine.

## Quickstart

### 1. Setup Virtual Environment
```bash
cd ai-service
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run FastAPI Server
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
Swagger UI is accessible at: `http://localhost:8000/docs`
Health check: `http://localhost:8000/health`
