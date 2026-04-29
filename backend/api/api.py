from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from backend.api.models import AttentionRequest, ModelInfo
from backend.transformer.transformer import Transformer
from backend.api.controller import get_attention_data
import json
import os
import torch
from transformers import AutoTokenizer


from backend.api.backprop import generate_backprop_steps

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
        self.app.get("/api/backprop")(self.get_backprop_data)

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

    def health(self):
        return {"status": "ok", "model_loaded": self.model is not None}

    def get_model_info(self):
        return ModelInfo(**self.model_config)

    def compute_attention(self, req: AttentionRequest):
        try:
            data = get_attention_data(self.model, self.tokenizer, req.sentence_a, req.sentence_b)
            return data
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    def get_backprop_data(self):
        return generate_backprop_steps()

