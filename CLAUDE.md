# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

"AI for Everyone" (lllm-explained) is an educational web app that explains how LLMs/Transformers and basic ML models work through interactive visualizations (attention heatmaps, gradient descent on cost surfaces, Adam optimizer steps, linear/logistic regression inference). It is a FastAPI backend + React/Vite frontend, split into two independent apps that talk over HTTP. Most UI copy is written in Spanish.

## Commands

### Frontend (`frontend/`)
```
npm install       # install deps
npm run dev       # start Vite dev server (default http://localhost:5173)
npm run build     # production build (vite build, no type-check) -> dist/
npm run lint      # eslint .
npm run preview   # preview production build
```
There is no frontend test runner configured.

### Backend (`backend/`, run from repo root so the `backend` package resolves)
Dependencies are managed with uv via the root `pyproject.toml` + `uv.lock` (not installed as a package: `tool.uv.package = false`).
```
uv sync                                          # create/update .venv from uv.lock
uv run backend/main.py                           # runs uvicorn with reload on :8000
# or
uv run uvicorn backend.main:app --reload --port 8000
uv add <pkg>                                     # add a dependency (updates pyproject + lock)
```
There is no backend test suite configured (no pytest present); `httpx` is in the `dev` group so `fastapi.testclient.TestClient` works.

The frontend expects the backend at `http://localhost:8000` (hardcoded `API_BASE` in [frontend/src/api.ts](frontend/src/api.ts)) — run both simultaneously for the app to work end to end.

## Architecture

### Backend: `backend/`
- `main.py` — entrypoint; inserts repo root on `sys.path` and runs uvicorn on the `APIHandler`'s FastAPI app.
- `api/api.py` — `APIHandler` class: owns the FastAPI app, CORS (`allow_origins=["*"]`), route registration in `setup_routes`, and loads model/config state at startup (`load_model`, called from the `lifespan` context manager). All routes are methods on this one class — add new endpoints here.
- `api/models.py` — Pydantic request/response schemas shared across routes, including the request limits (`MAX_ITERATIONS`, `MAX_LEARNING_RATE`, `MAX_SAMPLES`, ...) that bound how expensive a single call can be.
- `api/controller.py` — `get_attention_data`: runs the toy Transformer forward pass for given sentence(s) and reshapes attention/Q/K/V tensors into the nested dict shape (`all`/`aa`/`bb`/`ab`/`ba`) the frontend's attention visualizer expects (mirrors bertviz's data format for a from-scratch model).
- `api/backprop.py` — pure-numpy teaching implementations (not the `transformer/` package): Adam-optimized linear regression step generator (2D and 3D versions), generic matrix-form gradient descent, logistic regression gradient descent, and cost-surface grid generators for each. These back the Gradient Descent and Inference pages.
- `transformer/` — a small from-scratch PyTorch Transformer (encoder + decoder stack) built for pedagogy/inspectability, not production inference:
  - `transformer.py` — `Transformer` module wiring embeddings, sinusoidal positional encoding, encoder/decoder layer stacks, and output projection. `forward()` returns `(logits, attentions, ...)` where `attentions` is a per-layer list of dicts (`attn`, `queries`, `keys`, `values`, `attn_scores`) — this extra return data only exists to feed the attention visualizer, not for normal seq2seq use.
  - `encoder.py` / `decoder.py` — single encoder/decoder layer (self-attn, cross-attn for decoder, feed-forward, residual + LayerNorm), each returning attention internals alongside the layer output for the same visualization purpose.
  - `multi_head_attention.py` — manual scaled dot-product multi-head attention returning `attn_probs`/`Q`/`K`/`V`/`attn_scores`, not just the output, so the API can expose intermediate values.
  - `feed_forward.py` — position-wise feed-forward block.
  - Model hyperparameters live in `config/transformer.json` (loaded at startup); weights are randomly initialized (this is an untrained model used only to demonstrate architecture/attention shapes, not real generation quality). The tokenizer is `bert-base-uncased` from `transformers`.
- `trained_models/` — small pre-trained linear regression parameter sets (JSON) served via `/api/inference-scenario` for the Inference page's preset scenarios.
- `utils.py` — `load_model`/`save_model` JSON helpers for `trained_models/` (paths are relative, so these only work when the process CWD is `backend/`).

### Frontend: `frontend/src/`
- `App.tsx` — single-page shell with client-side state-based routing (no router library): `activePage` state picks which page component renders; navigation is done via `Sidebar`'s `setActivePage` callback, not URLs.
- `components/Sidebar.tsx` — nav menu rendered from `NAV_GROUPS` in `navigation.tsx`, plus language/theme switchers and a backend status dot that polls `/api/health`. Page components are mapped by id in the `PAGES` record in `App.tsx`.
- `pages/` — one component per top-level section (Home, History, Train, GradientDescent, Inference, Evaluation, Visualizer). Each page is largely self-contained and composes components from `components/`.
- `components/backprop/` — everything backing the Gradient Descent page: `TheoryContent` (explanatory text), `LinearRegressionContent`/`LogisticRegressionContent` (interactive tabs), `RegressionPlot(3D)`/`LogisticRegressionPlot(3D)`/`CostSurface`/`Backprop3D` (d3 2D charts and Three.js 3D scenes of gradient descent paths and cost surfaces), `types.ts` (shared prop/data types).
- `components/AttentionPlayground.tsx`, `AttentionStory.tsx`, `AttentionHeatmap.tsx`, `AttentionLines.tsx`, `MatrixView.tsx` — the Visualizer page's interactive theory walkthrough and live attention playground (heatmaps and Q/K/V matrix views driven by `/api/attention` responses).
- `api.ts` — thin fetch wrappers for all backend calls; add new response interfaces and fetch functions here rather than calling `fetch` directly from components.
- 2D charts and token/attention diagrams use `d3`. 3D scenes use React Three Fiber + drei (three.js) through the shared pieces in `components/three/`: `Scene3D` (canvas, lights, constrained `OrbitControls`, reset button, legend strip, DOM label layer), `Axes3D`, `Surface`/`Contours` (height field + d3-contour iso-lines), `Points`/`Residuals`, `DescentPath` (animated ball, trail, −∇ arrow), `Legend`, and `scale.ts` (every scene maps data into the same world box: x→[-1,1], second input→depth, value→up). Axis labels go through `useLabels` (`labels.tsx`), not drei `<Html>`, which mounts one React root per label.
- Styling is plain CSS, no Tailwind. Global layers in `src/styles/` (imported by `index.css`): `tokens.css` (colour/spacing/type/radius/shadow tokens for light and `[data-theme="dark"]`), `base.css` (reset, focus ring, range inputs, keyframes, `.animate-in`, `.visually-hidden`), `tones.css` (`data-tone="indigo|purple|cyan|orange|green|red|neutral"` sets `--tone`/`--tone-soft`/…), `prose.css` (`.prose` for long-form text plus the inline helpers `.mono`/`.tone-*` used inside locale JSX). Component styles are CSS Modules (`X.module.css` next to `X.tsx`); always use the tokens (`var(--accent-indigo)`, `var(--surface-card)`, …), never raw hex, so dark mode keeps working.
- Shared UI primitives live in `components/ui/`: `Page`/`PageHeader`/`Stack`, `Card`/`CardHeader`, `Button`, `Tabs` (the only tab/segmented control style), `Bits` (`StepBadge`, `SectionTitle`, `Callout`, `Formula`, `Slider`, `Stat`, `Figure`, `Status`, `Kbd`), `NextStep`, and `Icon` (inline SVG set; don't use emoji as icons). Build pages from these instead of ad-hoc markup.
- Theme: `theme.tsx` (`ThemeProvider`/`useTheme`, light (default) or dark, stored in localStorage `aife.theme`) sets `data-theme` on `<html>`; an inline script in `index.html` applies it before first paint. WebGL materials and SVG presentation attributes can't read CSS variables, so they take colours from `components/charts/chartTheme.ts` (`useChartTheme`, mirrors `tokens.css`); d3 charts use `.style("fill", "var(--…)")`.
- Navigation/learning path: `navigation.tsx` defines `NAV_GROUPS`, `PAGE_META` (icon, step number, group) and `PATH_ORDER`; the sidebar, page eyebrows, Home cards and `NextStep` all derive from it. Below 1024px the sidebar becomes an off-canvas drawer opened from the top bar in `App.tsx`.
