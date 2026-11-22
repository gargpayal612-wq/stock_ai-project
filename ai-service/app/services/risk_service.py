import numpy as np
from sklearn.linear_model import LogisticRegression
from app.schemas import DelayRiskRequest, DelayRiskResult

class DelayRiskService:
    def __init__(self):
        # Fit a calibrated baseline model on normalized logistics factors
        # Features: [unreliability, normalized_dist, weather_risk, customs_flag]
        X_train = np.array([
            [0.05, 0.2, 0.1, 0],  # Local, high-reliability, clear weather -> on time
            [0.10, 0.4, 0.2, 0],  # Domestic ground -> on time
            [0.25, 0.8, 0.7, 1],  # International, storms, customs -> delayed
            [0.35, 0.9, 0.8, 1],  # High unreliability, severe weather -> delayed
            [0.15, 0.6, 0.4, 0],  # Medium domestic -> on time
            [0.30, 0.5, 0.6, 0],  # Poor supplier, medium weather -> delayed
            [0.02, 0.1, 0.0, 0],  # Near hub, top tier supplier -> on time
            [0.20, 0.9, 0.5, 1],  # Overseas, average weather -> border risk
        ])
        y_train = np.array([0, 0, 1, 1, 0, 1, 0, 1])

        self.model = LogisticRegression(random_state=42)
        self.model.fit(X_train, y_train)

    def evaluate_risk(self, req: DelayRiskRequest) -> DelayRiskResult:
        unreliability = max(0.0, (100.0 - req.supplier_reliability) / 100.0)
        norm_dist = min(1.0, req.transit_distance_miles / 5000.0)
        weather = float(req.weather_risk_index)
        customs = 1.0 if req.customs_clearance_required or req.origin_country.upper() not in ["USA", "US"] else 0.0

        x = np.array([[unreliability, norm_dist, weather, customs]])
        prob = float(self.model.predict_proba(x)[0][1])

        # Categorize
        if prob >= 0.70:
            category = "HIGH"
        elif prob >= 0.35:
            category = "MEDIUM"
        else:
            category = "LOW"

        # Identify primary drivers
        factors = []
        if unreliability > 0.15:
            factors.append(f"Supplier reliability score is below benchmark ({req.supplier_reliability:.1f}%)")
        if customs == 1.0:
            factors.append("International transit requiring cross-border customs inspection clearance")
        if weather >= 0.40:
            factors.append(f"Adverse weather or route congestion index elevated ({weather:.2f})")
        if norm_dist > 0.60:
            factors.append(f"Long-haul logistics corridor ({req.transit_distance_miles:.0f} miles)")

        if not factors:
            factors.append("Optimal route and trusted carrier with high on-time history")

        # Actionable recommendations
        if category == "HIGH":
            action = "Contact carrier expediter immediately and request secondary routing or customs broker clearance priority."
        elif category == "MEDIUM":
            action = "Monitor shipment checkpoints closely at transit transfer hubs every 12 hours."
        else:
            action = "Standard automated tracking schedule; no manual intervention required."

        return DelayRiskResult(
            shipment_id=req.shipment_id,
            delay_risk_score=round(prob, 2),
            risk_category=category,
            primary_risk_factors=factors,
            recommended_action=action,
            model_used="Calibrated Logistic Regression (Scikit-Learn)"
        )

delay_risk_service = DelayRiskService()
