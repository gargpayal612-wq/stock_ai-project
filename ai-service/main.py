import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from typing import List, Dict, Any

load_dotenv()

from app.schemas import (
    ForecastRequest, 
    ForecastResult, 
    DelayRiskRequest, 
    DelayRiskResult,
    AssistantQueryRequest,
    AssistantQueryResponse
)
from app.services.forecasting_service import forecasting_service
from app.services.risk_service import delay_risk_service
from app.services.gemini_service import gemini_service

app = FastAPI(
    title="SupplyStock AI — Prediction & Intelligence Microservice",
    description="FastAPI service for Scikit-learn Demand Forecasting, Logistics Delay Risk Scoring, and Gemini AI Business Assistance",
    version="1.0.0"
)

# Enable CORS for frontend and backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {
        "status": "HEALTHY",
        "service": "SupplyStock AI Prediction Engine",
        "scikit_learn_ready": True,
        "gemini_configured": bool(os.getenv("GEMINI_API_KEY") and os.getenv("GEMINI_API_KEY") != "your_gemini_api_key_here")
    }

@app.post("/api/v1/forecast/predict", response_model=ForecastResult)
def predict_product_demand(request: ForecastRequest):
    try:
        result = forecasting_service.generate_forecast(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Forecasting error: {str(e)}")

@app.post("/api/v1/forecast/batch-recommendations", response_model=List[ForecastResult])
def batch_forecast_recommendations(requests: List[ForecastRequest]):
    results = []
    for req in requests:
        try:
            results.append(forecasting_service.generate_forecast(req))
        except Exception as e:
            continue
    return results

@app.post("/api/v1/risk/predict-shipment-delay", response_model=DelayRiskResult)
def predict_shipment_delay(request: DelayRiskRequest):
    try:
        return delay_risk_service.evaluate_risk(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Delay risk scoring error: {str(e)}")

@app.post("/api/v1/assistant/chat", response_model=AssistantQueryResponse)
def assistant_chat(request: AssistantQueryRequest):
    try:
        return gemini_service.query(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Assistant service error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
