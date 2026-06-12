from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from backend.api.models import AttentionRequest, ModelInfo, GradientDescentRequest, InferenceRequest
from backend.transformer.transformer import Transformer
from backend.api.controller import get_attention_data
import json
import os
import torch
from transformers import AutoTokenizer
import numpy as np

from backend.api.backprop import (
    generate_adam_steps, 
    generate_adam_3d,
    run_gradient_descent_matrix
)

class APIHandler:

    def __init__(self):
        self.model = None
        self.tokenizer = None
        self.model_config = {}
        self.app = FastAPI(title="Transformer API")
        self.app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
        self.app.on_event("startup")(self.load_model)
        self.setup_routes()

    def setup_routes(self):
        self.app.get("/api/health")(self.health)
        self.app.get("/api/model-info", response_model=ModelInfo)(self.get_model_info)
        self.app.post("/api/attention")(self.compute_attention)
        self.app.get("/api/adam")(self.get_adam_data)
        self.app.get("/api/adam-3d")(self.get_adam_3d_data)
        self.app.post("/api/gradient-descent-matrix")(self.run_gradient_descent_matrix_handler)
        self.app.post("/api/logistic-regression-matrix")(self.run_logistic_regression_matrix_handler)
        self.app.post("/api/predict")(self.predict)
        self.app.get("/api/inference-scenario")(self.get_inference_scenario)

    def load_model(self):
        # Config path is in backend/config/transformer.json
        # This file is in backend/transformer/api/api.py
        config_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "config", "transformer.json"))
        if os.path.exists(config_path):
            with open(config_path, "r") as f:
                self.model_config = json.load(f)
        else:
            raise RuntimeError(f"Config not found at {config_path}")

        self.model = Transformer(**self.model_config)
        self.model.eval()
        self.tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")

        # Load pre-trained linear regression models
        trained_models_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "trained_models", "simple_linear_reg.json"))
        if os.path.exists(trained_models_path):
            with open(trained_models_path, "r") as f:
                self.trained_linear_models = json.load(f)
        else:
            self.trained_linear_models = {}

    def health(self):
        return {"status": "ok", "model_loaded": self.model is not None, "trained_models_loaded": bool(self.trained_linear_models)}

    def get_model_info(self):
        return ModelInfo(**self.model_config)

    def compute_attention(self, req: AttentionRequest):
        try:
            data = get_attention_data(self.model, self.tokenizer, req.sentence_a, req.sentence_b)
            return data
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    def get_adam_data(self, learning_rate: float = 0.01, iterations: int = 100):
        return generate_adam_steps(iterations=iterations, learning_rate=learning_rate)

    def get_adam_3d_data(self, learning_rate: float = 0.01, iterations: int = 100):
        return generate_adam_3d(iterations=iterations, learning_rate=learning_rate)

    def run_gradient_descent_matrix_handler(self, req: GradientDescentRequest):
        from backend.api.backprop import get_matrix_cost_surface
        
        result = run_gradient_descent_matrix(
            X=req.X, 
            y=req.y, 
            iterations=req.iterations, 
            learning_rate=req.learning_rate
        )
        
        # Add cost surface for visualization if applicable
        X_arr = np.array(req.X)
        if X_arr.ndim == 1 or (X_arr.ndim == 2 and X_arr.shape[1] == 1):
            # 1D case (1 feature)
            w_range = np.linspace(-1, 5, 50)
            b_range = np.linspace(-2, 4, 50)
            result["cost_surface"] = get_matrix_cost_surface(req.X, req.y, w_range, b_range, mode='wb')
        elif X_arr.ndim == 2 and X_arr.shape[1] == 2:
            # 2D case (2 features)
            w1_range = np.linspace(-6, 8, 50)
            w2_range = np.linspace(-6, 10, 50)
            final_b = result.get("final_bias", 0.0)
            result["cost_surface"] = get_matrix_cost_surface(req.X, req.y, w1_range, w2_range, fixed_b=final_b, mode='ww')
            
        return result

    def run_logistic_regression_matrix_handler(self, req: GradientDescentRequest):
        from backend.api.backprop import run_logistic_regression_matrix, get_logistic_cost_surface
        
        result = run_logistic_regression_matrix(
            X=req.X, 
            y=req.y, 
            iterations=req.iterations, 
            learning_rate=req.learning_rate
        )
        
        X_arr = np.array(req.X)
        if X_arr.ndim == 1 or (X_arr.ndim == 2 and X_arr.shape[1] == 1):
            w_range = np.linspace(-10, 10, 50)
            b_range = np.linspace(-10, 10, 50)
            result["cost_surface"] = get_logistic_cost_surface(req.X, req.y, w_range, b_range, mode='wb')
        elif X_arr.ndim == 2 and X_arr.shape[1] == 2:
            w1_range = np.linspace(-10, 10, 50)
            w2_range = np.linspace(-10, 10, 50)
            final_b = result.get("final_bias", 0.0)
            result["cost_surface"] = get_logistic_cost_surface(req.X, req.y, w1_range, w2_range, fixed_b=final_b, mode='ww')
            
        return result


    def predict(self, req: InferenceRequest):
        try:
            x = np.array(req.x)
            weights = np.array(req.weights)
            prediction = np.dot(x, weights) + req.bias
            return {"prediction": float(prediction)}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    def get_inference_scenario(self, scenario: str = "generic"):
        try:
            if scenario in self.trained_linear_models:
                data = self.trained_linear_models[scenario]
                return {
                    "X": data["x"],
                    "y": data["y"],
                    "weights": data["weights"],
                    "bias": data["bias"]
                }
            else:
                raise HTTPException(status_code=404, detail=f"Scenario '{scenario}' not found")
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
