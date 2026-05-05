const API_BASE = "http://localhost:8000";

export interface HealthResponse {
  status: string;
}

export interface ModelInfoResponse {
  src_vocab_size: number;
  tgt_vocab_size: number;
  d_model: number;
  num_heads: number;
  num_layers: number;
  d_ff: number;
  max_seq_length: number;
  dropout: number;
}

export interface AttentionResponse {
  sentence_a: string[];
  sentence_b: string[] | null;
  attention: number[][][][]; // [layer, head, row, col]
}

export async function fetchHealth(): Promise<HealthResponse> {
  const res = await fetch(`${API_BASE}/api/health`);
  if (!res.ok) throw new Error("Backend unreachable");
  return res.json();
}

export async function fetchModelInfo(): Promise<ModelInfoResponse> {
  const res = await fetch(`${API_BASE}/api/model-info`);
  if (!res.ok) throw new Error("Failed to fetch model info");
  return res.json();
}

export async function fetchAttention(sentenceA: string, sentenceB: string | null = null): Promise<AttentionResponse> {
  const body: { sentence_a: string; sentence_b?: string } = { sentence_a: sentenceA };
  if (sentenceB) body.sentence_b = sentenceB;

  const res = await fetch(`${API_BASE}/api/attention`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    throw new Error(detail.detail || "Failed to compute attention");
  }
  return res.json();
}
