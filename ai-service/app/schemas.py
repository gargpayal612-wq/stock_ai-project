from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class ForecastRequest(BaseModel):
    product_id: int = Field(..., description="Unique product ID")
    product_name: str = Field(..., description="Product name")
    horizon_days: int = Field(30, description="Forecast horizon in days (e.g. 7, 14, 30)")
    available_stock: int = Field(0, description="Current warehouse available units")
    incoming_stock: int = Field(0, description="Expected incoming purchase order units")
    min_safety_stock: int = Field(10, description="Minimum buffer stock threshold")
    historical_sales: Optional[List[int]] = Field(default=None, description="Recent daily or weekly sales volume")

class ForecastResult(BaseModel):
    product_id: int
    product_name: str
    forecast_horizon_days: int
    baseline_predicted_demand: int
    ml_predicted_demand: int
    confidence_lower: int
    confidence_upper: int
    safety_stock: int
    available_stock: int
    incoming_stock: int
    recommended_purchase_quantity: int
    model_name: str
    model_accuracy_r2: float
    is_demo_estimate: bool
    explanation: str

class DelayRiskRequest(BaseModel):
    shipment_id: str
    carrier_name: str
    supplier_id: int
    supplier_reliability: float = Field(..., ge=0.0, le=100.0)
    origin_country: str = "USA"
    transit_distance_miles: float = 500.0
    weather_risk_index: float = Field(0.1, ge=0.0, le=1.0)
    customs_clearance_required: bool = False

class DelayRiskResult(BaseModel):
    shipment_id: str
    delay_risk_score: float
    risk_category: str  # LOW, MEDIUM, HIGH
    primary_risk_factors: List[str]
    recommended_action: str
    model_used: str

class ChatMessage(BaseModel):
    role: str
    content: str

class AssistantQueryRequest(BaseModel):
    prompt: str
    user_role: str = "RETAILER"
    context_data: Optional[Dict[str, Any]] = None
    chat_history: Optional[List[ChatMessage]] = None

class AssistantQueryResponse(BaseModel):
    reply: str
    source_attribution: List[str]
    provider: str
