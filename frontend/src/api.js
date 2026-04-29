const API_BASE = "http://localhost:8000";

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/api/health`);
  if (!res.ok) throw new Error("Backend unreachable");
  return res.json();
}

export async function fetchModelInfo() {
  const res = await fetch(`${API_BASE}/api/model-info`);
  if (!res.ok) throw new Error("Failed to fetch model info");
  return res.json();
}

export async function fetchAttention(sentenceA, sentenceB = null) {
  const body = { sentence_a: sentenceA };
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
