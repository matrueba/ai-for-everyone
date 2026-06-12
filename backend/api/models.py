from pydantic import BaseModel
from typing import Optional, List

class GradientDescentRequest(BaseModel):
    X: List[List[float]]
    y: List[float]
    learning_rate: float = 0.01
    iterations: int = 100


class AttentionRequest(BaseModel):
    sentence_a: str
    sentence_b: Optional[str] = None


class ModelInfo(BaseModel):
    src_vocab_size: int
    tgt_vocab_size: int
    d_model: int
    num_heads: int
    num_layers: int
    d_ff: int
    max_seq_length: int
    dropout: float

    
class InferenceRequest(BaseModel):
    x: List[float]
    weights: List[float]
    bias: float
