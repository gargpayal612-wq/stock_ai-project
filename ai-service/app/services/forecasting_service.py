import numpy as np
import pandas as pd
from typing import List, Optional
#from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score
from app.schemas import ForecastRequest, ForecastResult

class DemandForecastingService:
    def __init__(self):
        # Seeded baseline generator for realistic synthetic series when data is sparse
        pass

    def _generate_synthetic_history(self, product_id: int, horizon: int) -> np.ndarray:
        """Generates realistic seasonal sales history if explicit history is not provided."""
        np.random.seed(product_id * 42 % 10000)
        n_days = 90
        base_demand = 15.0 + (product_id % 7) * 8.0
        time = np.arange(n_days)
        # Add weekly seasonality and slight trend
        seasonality = 5.0 * np.sin(2 * np.pi * time / 7.0)
        trend = 0.05 * time
        noise = np.random.normal(0, 3.0, n_days)
        sales = np.maximum(1, np.round(base_demand + seasonality + trend + noise)).astype(int)
        return sales

    def generate_forecast(self, req: ForecastRequest) -> ForecastResult:
        # Determine sales series
        if req.historical_sales and len(req.historical_sales) >= 14:
            sales = np.array(req.historical_sales, dtype=float)
            is_demo = False
        else:
            sales = self._generate_synthetic_history(req.product_id, req.horizon_days).astype(float)
            is_demo = True

        n = len(sales)
        # Create lag features for ML model: [lag_1, lag_2, lag_7, rolling_mean_7, rolling_std_7]
        df = pd.DataFrame({'sales': sales})
        df['lag_1'] = df['sales'].shift(1)
        df['lag_2'] = df['sales'].shift(2)
        df['lag_7'] = df['sales'].shift(7)
        df['rolling_mean_7'] = df['sales'].shift(1).rolling(window=7, min_periods=1).mean()
        df['rolling_std_7'] = df['sales'].shift(1).rolling(window=7, min_periods=1).std().fillna(1.0)
        df['day_idx'] = np.arange(n)
        
        # Clean training set
        train_df = df.dropna().copy()
        features = ['lag_1', 'lag_2', 'lag_7', 'rolling_mean_7', 'rolling_std_7', 'day_idx']
        
        X = train_df[features].values
        y = train_df['sales'].values

        # Baseline: 7-day Simple Moving Average scaled to the horizon
        recent_daily_avg = float(np.mean(sales[-14:]))
        baseline_prediction = int(round(recent_daily_avg * req.horizon_days))

        # Train Scikit-learn RandomForestRegressor
        ml_model = RandomForestRegressor(n_estimators=50, max_depth=5, random_state=42)
        ml_model.fit(X, y)
        
        y_pred = ml_model.predict(X)
        r2 = float(np.clip(r2_score(y, y_pred), 0.0, 0.98))

        # Multi-step autoregressive rollout for future horizon
        simulated_history = list(sales)
        predicted_daily_steps = []

        for step in range(req.horizon_days):
            curr_len = len(simulated_history)
            curr_day_idx = curr_len
            lag_1 = simulated_history[-1]
            lag_2 = simulated_history[-2] if curr_len >= 2 else lag_1
            lag_7 = simulated_history[-7] if curr_len >= 7 else lag_1
            r_mean = float(np.mean(simulated_history[-7:]))
            r_std = float(np.std(simulated_history[-7:])) or 1.0

            x_step = np.array([[lag_1, lag_2, lag_7, r_mean, r_std, curr_day_idx]])
            pred_step = float(ml_model.predict(x_step)[0])
            pred_step = max(1.0, pred_step)
            predicted_daily_steps.append(pred_step)
            simulated_history.append(pred_step)

        ml_predicted_total = int(round(float(sum(predicted_daily_steps))))
        
        # Confidence interval estimation (approx 90% confidence based on model std)
        std_err = float(np.std(y - y_pred)) if len(y) > 0 else 5.0
        confidence_delta = int(round(std_err * np.sqrt(req.horizon_days) * 1.645))
        confidence_lower = max(0, ml_predicted_total - confidence_delta)
        confidence_upper = ml_predicted_total + confidence_delta

        # EXACT RESTOCKING FORMULA SPECIFIED IN PROMPT:
        # Recommended Purchase Quantity = Predicted Demand + Safety Stock − Available Stock − Expected Incoming Stock
        # Do not allow negative recommended quantities.
        raw_recommendation = (ml_predicted_total + req.min_safety_stock) - req.available_stock - req.incoming_stock
        recommended_qty = max(0, raw_recommendation)

        explanation = (
            f"Model predicts {ml_predicted_total} units demanded over next {req.horizon_days} days. "
            f"With safety buffer of {req.min_safety_stock}, current stock of {req.available_stock}, "
            f"and incoming pipeline of {req.incoming_stock}, "
            f"recommended replenishment order is {recommended_qty} units."
        )

        return ForecastResult(
            product_id=req.product_id,
            product_name=req.product_name,
            forecast_horizon_days=req.horizon_days,
            baseline_predicted_demand=baseline_prediction,
            ml_predicted_demand=ml_predicted_total,
            confidence_lower=confidence_lower,
            confidence_upper=confidence_upper,
            safety_stock=req.min_safety_stock,
            available_stock=req.available_stock,
            incoming_stock=req.incoming_stock,
            recommended_purchase_quantity=recommended_qty,
            model_name="RandomForestRegressor (Scikit-Learn)",
            model_accuracy_r2=round(r2, 4),
            is_demo_estimate=is_demo,
            explanation=explanation
        )

forecasting_service = DemandForecastingService()
