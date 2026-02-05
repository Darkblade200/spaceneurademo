# Multimodal All-in-One AI Chat App — Production-Ready Architecture

## 1) Product Vision & Non-Goals

### Vision
Build a **single, trustworthy, multimodal AI workspace** that lets users:
- Chat with multiple AI providers in one place (OpenAI where free-tier is available, Anthropic access tiers, DeepSeek, Qwen, Mistral, LLaMA/open models).
- Use text, image, OCR scan, and document chat in a unified flow.
- Route prompts intelligently to the best model via an **Auto Router** while enabling manual override.
- Compare outputs from multiple models side-by-side.
- See transparent model limits, pricing/quotas, and fallback behavior.
- Keep sensitive work local via Ollama/LM Studio private inference mode.

### Non-goals (MVP)
- Building/training custom foundation models.
- Full enterprise compliance (SOC2/HIPAA) in MVP; only foundational controls.
- Massive plugin ecosystem before v1.

---

## 2) Key Product Pillars

1. **Unified Multimodal UX**
   - One conversation object supports text + image + extracted OCR text + document chunks.

2. **Smart Routing + User Control**
   - Auto router picks models using intent, latency, and quota.
   - Power users can pin model/provider explicitly.

3. **Transparent Operations**
   - Real-time badges: model used, token usage, estimated cost, rate-limit status, context window utilization.

4. **Privacy by Design**
   - Data minimization, encrypted-at-rest metadata, optional local-only processing path.

5. **Modular Scalability**
   - Provider adapters, OCR workers, retrieval service, and router policies are independent modules.

---

## 3) High-Level System Architecture

### Logical Architecture (Services)
- **Mobile Client (React Native + Expo)**
  - Screens: Chat, Compare, OCR Scan, Prompt Lab, Settings.
  - Streams responses via SSE/WebSocket gateway.

- **API Gateway / BFF**
  - AuthN/AuthZ, request validation, feature flags, rate limiting.
  - Unified API shape for client.

- **Orchestration Service**
  - Session state coordination.
  - Tool invocation sequence (OCR, retrieval, provider call).
  - Streaming token fan-out to clients.

- **Model Router Service**
  - Rule + score-based model selection.
  - Manual override enforcement.
  - Provider health and quota-aware fallback.

- **Provider Adapter Layer**
  - OpenAIAdapter, AnthropicAdapter, DeepSeekAdapter, QwenAdapter, MistralAdapter, OpenLLMAdapter (Ollama/LM Studio proxy).
  - Normalizes: prompt schema, streaming format, tool calls, errors.

- **OCR Service**
  - Tesseract and PaddleOCR abstraction.
  - Image pre-processing pipeline (deskew, denoise, contrast).

- **Document/RAG Service**
  - Parsing (PDF/DOCX/TXT), chunking, embedding, vector retrieval.

- **Data Stores**
  - PostgreSQL for accounts/projects/chat metadata.
  - Redis for cache, streams fanout state, and rate-limit counters.
  - Object storage (S3-compatible/MinIO) for file blobs.
  - Vector DB (Qdrant/Weaviate/pgvector).

- **Observability & Ops**
  - OpenTelemetry traces, Prometheus metrics, Loki/ELK logs.

### Deployment Topology
- **Frontend**: Expo EAS build + OTA updates.
- **Backend**: Containerized microservices on Kubernetes or ECS.
- **Workers**: OCR and ingestion workers auto-scaled from queue depth.
- **Edge**: CDN + WAF + API gateway rate limiting.

---

## 4) Frontend Architecture (React Native + Expo + Framer Motion)

### Core Stack
- **React Native (Expo)** for cross-platform app.
- **TypeScript** strict mode.
- **Expo Router** for navigation.
- **State**: Zustand (UI/session state) + TanStack Query (server/cache state).
- **Animations**: Framer Motion-inspired patterns for RN (via `moti` / Reanimated), preserving the motion language.
- **UI**: Tailwind RN or custom design system with dark-first tokens.

### Screen Specifications

1. **Chat Screen**
   - Thread list + active thread panel.
   - Input supports text, image attach, camera OCR, document attach.
   - Streaming token rendering with typing cursor.
   - Message chips: provider/model, latency, token/cost.

2. **Compare Screen**
   - Prompt editor + selectable model matrix.
   - Parallel execution across N models.
   - Aligned cards with diff/highlight mode.
   - “Promote response to chat” action.

3. **OCR Scan Screen**
   - Camera capture + gallery import.
   - Auto-crop, perspective correction, OCR engine switch.
   - Confidence heatmap and editable extracted text.

4. **Prompt Lab**
   - Template library, variables, test data.
   - Save prompt versions and benchmark across models.

5. **Settings Screen**
   - API key vault references (never plaintext in UI state).
   - Router policy controls (speed/quality/privacy).
   - Local inference toggles (Ollama/LM Studio endpoint).
   - Usage dashboard and quotas.

### Dark-First Visual Language
- Palette: near-black surfaces with electric accent gradients.
- Typography: high contrast, large leading for readability.
- Motion:
  - Spring-based message entrance.
  - Shared element transitions between thread and compare detail.
  - Subtle parallax gradients and blur cards.
- Accessibility:
  - WCAG AA contrast, reduced-motion fallback, dynamic type scaling.

---

## 5) Backend Architecture & Separation of Concerns

### Service Boundaries
- **Gateway/BFF**
  - Handles only client orchestration and auth context.

- **Orchestrator**
  - Owns conversation execution graph and streaming lifecycle.

- **Router**
  - Stateless scoring service + policy config store.

- **Adapters**
  - Pure provider concerns; no business rules.

- **OCR/RAG Workers**
  - Async heavy compute tasks, queue-driven.

### Suggested Tech Stack
- **Language/Framework**: Node.js (NestJS/Fastify) or Go for high-throughput orchestration.
- **Queue**: BullMQ/RabbitMQ/NATS JetStream.
- **DB**: PostgreSQL + Redis + Qdrant.
- **Storage**: S3-compatible buckets.
- **Infra as Code**: Terraform + Helm.

---

## 6) Smart Model Router Design

### Inputs to Routing Decision
- Intent classification: coding, summarization, OCR cleanup, document QA, image understanding.
- Constraints: latency target, budget cap, privacy mode, token window requirement.
- Real-time signals: provider health, recent failures, current quotas, p95 latency.

### Scoring
`score = w_quality*quality + w_latency*(1/latency) + w_cost*(1/cost) + w_reliability*successRate + policyBoost`

### Routing Modes
- **Auto (default)**: best score among eligible models.
- **Manual override**: exact provider/model pin, with fallback only if user allows.
- **Compare mode**: top-K candidate execution.

### Safety/Fallback Policy
1. Try primary model.
2. On timeout/rate-limit, fallback to same capability tier.
3. If privacy mode enabled, fallback only to local models.
4. Emit transparent fallback event to UI.

---

## 7) Streaming Responses

### Transport Choice
- **SSE** for standard token streaming (simple, mobile-friendly).
- **WebSocket** for duplex features (real-time compare progress, collaborative sessions).

### Stream Event Envelope
```json
{
  "conversationId": "...",
  "messageId": "...",
  "event": "token|tool_start|tool_end|usage|final|error|fallback",
  "provider": "mistral",
  "model": "mistral-small",
  "payload": {}
}
```

### Reliability
- Message sequence numbers.
- Resume token for reconnect.
- Idempotent finalization writes.

---

## 8) OCR & Document Chat Pipeline

### OCR Flow
1. Image ingest from camera/file.
2. Preprocess: orientation, denoise, threshold.
3. OCR engine selection:
   - Tesseract for lightweight offline.
   - PaddleOCR for higher accuracy/multilingual.
4. Post-process: line merge, confidence filter, optional language model cleanup.
5. Return structured text blocks + bounding boxes.

### Document Chat (RAG)
1. Parse document via unstructured/text extraction.
2. Chunk with overlap by semantic boundaries.
3. Embed chunks (open embedding model or provider embeddings).
4. Store vectors + metadata.
5. Query-time retrieve top-k + re-rank.
6. Inject context with citations into generation prompt.

---

## 9) Data Model (Core Entities)

- `User(id, email, tier, createdAt)`
- `Workspace(id, ownerId, name)`
- `Conversation(id, workspaceId, mode, createdAt)`
- `Message(id, conversationId, role, content, modelUsed, usageStats, createdAt)`
- `Attachment(id, messageId, type, uri, ocrStatus, metadata)`
- `ModelPolicy(id, workspaceId, autoRoutingConfig, privacyMode)`
- `UsageLedger(id, workspaceId, provider, model, inputTokens, outputTokens, estimatedCost, ts)`

---

## 10) Security, Privacy, and Compliance Foundations

### Security Controls
- OAuth2/OIDC auth, short-lived JWT access tokens.
- Row-level authorization by workspace.
- API key secrets in KMS/Secrets Manager.
- Encryption at rest (DB + object storage) and TLS in transit.
- Request/response size limits and MIME validation for uploads.

### Privacy Controls
- Data retention controls per workspace.
- Opt-out from provider data retention where APIs permit.
- Local inference mode routes prompts/files only to local runtime.
- PII redaction middleware (optional) before external provider dispatch.

### Abuse & Safety
- Prompt injection heuristics for doc context.
- Content moderation adapter layer (provider + open-source fallback).
- Per-user and per-IP rate limits.

---

## 11) Performance & Scalability

- Token streaming backpressure handling in gateway.
- Redis caching for model metadata and quotas.
- Batch embeddings for document ingestion.
- Pre-warmed adapter pools for common models.
- Queue-based OCR/doc parsing to avoid API timeouts.
- Horizontal pod autoscaling on CPU + queue depth + p95 latency.

Target SLOs (v1):
- p95 first token latency < 1.8s (cloud models).
- 99.9% chat API availability.
- OCR single-page median < 2.5s on worker GPU tier.

---

## 12) MVP → v1 Roadmap (Implementation-Focused)

### Phase 0 (2 weeks): Foundations
- Repo setup, CI/CD, lint/test baselines.
- Auth, workspace model, conversation CRUD.
- Initial provider adapters: OpenAI-compatible + one open model backend.

### Phase 1 (4–6 weeks): MVP Core
- Chat UI with streaming text.
- Auto router v1 (rules + health fallback).
- Basic OCR (Tesseract) from image upload.
- Usage ledger and limits UI.
- Local inference integration (Ollama endpoint).

### Phase 2 (4 weeks): Multimodal + Compare
- Image understanding pipeline.
- Compare mode parallel prompts.
- Document upload + baseline RAG.
- Settings for routing policies and privacy mode.

### Phase 3 (4–6 weeks): Hardening to v1
- PaddleOCR option + OCR quality tooling.
- Router scoring engine with telemetry feedback loop.
- Observability dashboards, chaos/failure testing.
- Security hardening, data lifecycle controls, performance tuning.

---

## 13) Realistic Constraints & Tradeoffs

- Free-tier model availability is volatile; must support dynamic provider capability registry.
- Cost transparency is estimate-based for some providers; UI should label confidence.
- On-device/local inference quality may be below flagship hosted models; expose “quality mode” guidance.
- OCR quality depends heavily on image preprocessing and language packs.

---

## 14) Recommended Initial Monorepo Layout

```txt
apps/
  mobile-expo/
  api-gateway/
  orchestrator/
services/
  router/
  ocr-worker/
  rag-worker/
packages/
  ui-kit/
  config/
  types/
  provider-adapters/
  observability/
infrastructure/
  terraform/
  helm/
```

This layout keeps UI, orchestration, workers, and shared contracts separated while enabling independent scaling and deployment cadence.
