# Neura One (React Native / Expo)

Production-oriented starter app for a multimodal all-in-one AI chat product.

## Implemented MVP Scaffold

- Dark-first multi-screen React Native UI:
  - Chat
  - Compare
  - OCR
  - Prompt Lab
  - Settings
- Smart model routing service (auto mode + privacy local-only filter)
- Manual router toggle in UI
- Streaming-style assistant response simulation (SSE/WebSocket compatible event shape)
- Zustand state management for chat/session control

## Run

```bash
npm install
npm run start
```

Then open in Expo Go or simulator.

## Next Integration Tasks

- Replace mock streaming service with real SSE/WebSocket backend client.
- Add provider adapters and signed backend API calls.
- Wire camera/gallery and OCR worker APIs.
- Add vector-RAG document ingestion and chat citations.
