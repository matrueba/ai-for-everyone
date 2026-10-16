from pydantic import BaseModel, Field, model_validator
from typing import Annotated, Optional, List

# Upper bounds that keep a single request cheap; the frontend stays well below them
MAX_ITERATIONS = 1000
MAX_LEARNING_RATE = 1.0
MAX_SAMPLES = 1000
MAX_FEATURES = 10
MAX_SENTENCE_CHARS = 1000

Row = Annotated[List[float], Field(min_length=1, max_length=MAX_FEATURES)]


class GradientDescentRequest(BaseModel):
    X: List[Row] = Field(min_length=1, max_length=MAX_SAMPLES)
    y: List[float] = Field(min_length=1, max_length=MAX_SAMPLES)
    learning_rate: float = Field(0.01, gt=0, le=MAX_LEARNING_RATE)
    iterations: int = Field(100, ge=1, le=MAX_ITERATIONS)

    @model_validator(mode="after")
    def check_shapes(self):
        if len(self.X) != len(self.y):
            raise ValueError(f"X has {len(self.X)} rows but y has {len(self.y)} values")
        if len({len(row) for row in self.X}) != 1:
            raise ValueError("All rows of X must have the same number of features")
        return self


class AttentionRequest(BaseModel):
    sentence_a: str = Field(min_length=1, max_length=MAX_SENTENCE_CHARS)
    sentence_b: Optional[str] = Field(None, max_length=MAX_SENTENCE_CHARS)


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
    x: List[float] = Field(min_length=1, max_length=MAX_FEATURES)
    weights: List[float] = Field(min_length=1, max_length=MAX_FEATURES)
    bias: float
