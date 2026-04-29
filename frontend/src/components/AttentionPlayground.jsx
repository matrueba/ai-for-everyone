import { useState, useEffect } from "react";
import { fetchAttention, fetchModelInfo } from "../api";
import AttentionLines from "./AttentionLines";
import AttentionHeatmap from "./AttentionHeatmap";
import MatrixView from "./MatrixView";

export default function AttentionPlayground() {
  const [sentence, setSentence] = useState(
    "At the store, she bought apples, oranges, bananas,"
  );
  const [attentionData, setAttentionData] = useState(null);
  const [modelInfo, setModelInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [layer, setLayer] = useState(0);
  const [head, setHead] = useState(0);
  const [viewMode, setViewMode] = useState("lines"); // "lines" | "heatmap" | "matrix"

  // Load model info on mount
  useEffect(() => {
    fetchModelInfo()
      .then(setModelInfo)
      .catch(() => { });
  }, []);

  const handleAnalyze = async () => {
    if (!sentence.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAttention(sentence.trim());
      setAttentionData(data);
      setLayer(0);
      setHead(0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAnalyze();
  };

  const filterData = attentionData?.all;
  const nLayers = filterData?.attn?.length || 0;
  const nHeads = filterData?.attn?.[0]?.length || 0;

  return (
    <div className="flex flex-col min-w-0 max-w-4xl lg:mr-auto w-full">
      {/* Input panel */}
      <div className="bg-surface-card border border-border-default rounded-2xl p-6 mb-7 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.06)]">
        <p className="text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-4">
          Input Sentence
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            id="sentence-input"
            type="text"
            value={sentence}
            onChange={(e) => setSentence(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a sentence to analyze…"
            className="flex-1 bg-surface-secondary border border-border-default rounded-lg px-4 py-3.5 text-[0.95rem] text-text-primary font-sans placeholder:text-text-muted outline-none transition-all focus:border-accent-indigo focus:shadow-[0_0_0_3px_rgba(99,102,241,0.25)]"
          />
          <button
            id="analyze-btn"
            onClick={handleAnalyze}
            disabled={loading || !sentence.trim()}
            className="flex items-center justify-center gap-2 px-7 py-3.5 bg-gradient-to-r from-accent-indigo via-purple-500 to-accent-cyan rounded-lg text-white text-sm font-semibold cursor-pointer whitespace-nowrap shadow-[0_2px_12px_rgba(79,70,229,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(79,70,229,0.35)] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
          >
            <span className="text-base">⚡</span>
            {loading ? "Analyzing…" : "Analyze"}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 bg-accent-red/8 border border-accent-red/20 rounded-lg px-5 py-3.5 mb-5">
          <span className="text-xl shrink-0">⚠️</span>
          <p className="text-sm text-accent-red">{error}</p>
        </div>
      )}

      {/* Controls bar — only show when we have data */}
      {attentionData && (
        <div className="flex flex-wrap items-center gap-4 mb-6 bg-surface-card border border-border-default rounded-2xl p-4 shadow-sm">
          {/* Layer select */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="layer-select"
              className="text-xs font-medium uppercase tracking-wide text-text-tertiary"
            >
              Layer
            </label>
            <div className="relative">
              <select
                id="layer-select"
                value={layer}
                onChange={(e) => setLayer(+e.target.value)}
                className="appearance-none bg-surface-secondary border border-border-default rounded-md px-3.5 py-2 pr-8 font-mono text-sm text-text-primary cursor-pointer outline-none transition-colors hover:border-text-tertiary focus:border-accent-indigo focus:shadow-[0_0_0_3px_rgba(99,102,241,0.25)] bg-no-repeat bg-[position:right_10px_center] bg-[length:12px] bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2212%22%20height=%2212%22%20fill=%22%2394a3b8%22%20viewBox=%220%200%2016%2016%22%3E%3Cpath%20d=%22M8%2011L3%206h10z%22/%3E%3C/svg%3E')]"
              >
                {Array.from({ length: nLayers }, (_, i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Head select */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="head-select"
              className="text-xs font-medium uppercase tracking-wide text-text-tertiary"
            >
              Head
            </label>
            <div className="relative">
              <select
                id="head-select"
                value={head}
                onChange={(e) => setHead(+e.target.value)}
                className="appearance-none bg-surface-secondary border border-border-default rounded-md px-3.5 py-2 pr-8 font-mono text-sm text-text-primary cursor-pointer outline-none transition-colors hover:border-text-tertiary focus:border-accent-indigo focus:shadow-[0_0_0_3px_rgba(99,102,241,0.25)] bg-no-repeat bg-[position:right_10px_center] bg-[length:12px] bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2212%22%20height=%2212%22%20fill=%22%2394a3b8%22%20viewBox=%220%200%2016%2016%22%3E%3Cpath%20d=%22M8%2011L3%206h10z%22/%3E%3C/svg%3E')]"
              >
                {Array.from({ length: nHeads }, (_, i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-2">
            <div className="flex bg-surface-secondary border border-border-default rounded-md overflow-hidden">
              <button
                id="view-lines-btn"
                onClick={() => setViewMode("lines")}
                className={`px-3 py-1.5 text-xs font-medium cursor-pointer transition-colors ${viewMode === "lines" ? "bg-accent-indigo/20 text-accent-indigo" : "text-text-secondary hover:text-text-primary"}`}
              >
                Flow
              </button>
              <button
                id="view-heatmap-btn"
                onClick={() => setViewMode("heatmap")}
                className={`px-3 py-1.5 text-xs font-medium cursor-pointer transition-colors border-l border-border-default ${viewMode === "heatmap" ? "bg-accent-indigo/20 text-accent-indigo" : "text-text-secondary hover:text-text-primary"}`}
              >
                Heatmap
              </button>
              <button
                id="view-matrix-btn"
                onClick={() => setViewMode("matrix")}
                className={`px-3 py-1.5 text-xs font-medium cursor-pointer transition-colors border-l border-border-default ${viewMode === "matrix" ? "bg-accent-indigo/20 text-accent-indigo" : "text-text-secondary hover:text-text-primary"}`}
              >
                Matrix
              </button>
            </div>
          </div>

          {/* Model info chips */}
          {modelInfo && (
            <div className="flex flex-wrap gap-2 ml-auto">
              {[
                ["Layers", modelInfo.num_layers],
                ["Heads", modelInfo.num_heads],
                ["d_model", modelInfo.d_model],
                ["d_ff", modelInfo.d_ff],
              ].map(([label, value]) => (
                <span
                  key={label}
                  className="flex items-center gap-1.5 bg-surface-elevated border border-border-subtle rounded-full px-3 py-1 text-[0.6rem] font-mono"
                >
                  <span className="text-text-tertiary font-medium uppercase tracking-wide">
                    {label}
                  </span>
                  <span className="text-accent-cyan font-semibold">
                    {value}
                  </span>
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Visualization ── */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-5 bg-surface-card border border-border-default rounded-2xl">
          <div className="w-10 h-10 rounded-full border-3 border-border-default border-t-accent-indigo animate-spin" />
          <p className="text-sm text-text-tertiary">
            Running forward pass…
          </p>
        </div>
      )}

      {!loading && !attentionData && (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-surface-card border border-border-default rounded-2xl">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-accent-indigo via-purple-500 to-accent-cyan flex items-center justify-center text-4xl mb-6 shadow-[0_0_30px_rgba(79,70,229,0.2)] animate-pulse-glow">
            🔬
          </div>
          <h2 className="text-xl font-bold tracking-tight mb-2.5">
            Ready to Analyze
          </h2>
          <p className="text-sm text-text-secondary max-w-[380px] leading-relaxed">
            Enter a sentence above to see the Transformer in action.
          </p>
        </div>
      )}

      {!loading && attentionData && filterData && (
        <div className="flex flex-col gap-6">
          {/* Attention Flow / Lines */}
          <div className="bg-surface-card border border-border-default rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle bg-surface-card/60">
              <h3 className="text-sm font-semibold text-text-primary">
                {viewMode === "lines"
                  ? "Attention Flow"
                  : viewMode === "heatmap"
                    ? "Attention Heatmap"
                    : "Q / K Matrix"}
              </h3>
              <span className="text-xs text-text-tertiary font-mono">
                Layer {layer} · Head {head}
              </span>
            </div>
            <div className="p-6 overflow-x-auto flex justify-center min-h-[400px]">
              {viewMode === "lines" && (
                <AttentionLines
                  data={filterData}
                  layer={layer}
                  head={head}
                />
              )}
              {viewMode === "heatmap" && (
                <AttentionHeatmap
                  data={filterData}
                  layer={layer}
                  head={head}
                />
              )}
              {viewMode === "matrix" && (
                <MatrixView
                  data={filterData}
                  layer={layer}
                  head={head}
                />
              )}
            </div>
          </div>

          {/* Tokens list */}
          <div className="bg-surface-card border border-border-default rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle bg-surface-card/60">
              <h3 className="text-sm font-semibold text-text-primary">
                Tokenized Input
              </h3>
              <span className="text-xs text-text-tertiary font-mono">
                {filterData.left_text.length} tokens
              </span>
            </div>
            <div className="p-6 flex flex-wrap gap-2">
              {filterData.left_text.map((tok, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 bg-surface-elevated border border-border-subtle rounded-md px-3 py-1.5 text-xs font-mono"
                >
                  <span className="text-text-muted text-[0.65rem]">
                    {i}
                  </span>
                  <span className="text-text-primary">{tok}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
