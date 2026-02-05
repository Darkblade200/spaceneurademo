import { create } from 'zustand';
import { Message, RouterMode, TaskKind } from '../types';
import { routeModel } from '../services/router';
import { streamMockResponse } from '../services/streaming';

type ChatState = {
  messages: Message[];
  input: string;
  routerMode: RouterMode;
  manualModelId?: string;
  privacyModeLocalOnly: boolean;
  taskKind: TaskKind;
  isStreaming: boolean;
  setInput: (input: string) => void;
  setRouterMode: (mode: RouterMode) => void;
  setManualModelId: (modelId?: string) => void;
  setPrivacyModeLocalOnly: (value: boolean) => void;
  setTaskKind: (task: TaskKind) => void;
  sendMessage: () => Promise<void>;
};

const id = () => Math.random().toString(36).slice(2, 9);

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  input: '',
  routerMode: 'auto',
  privacyModeLocalOnly: false,
  taskKind: 'chat',
  isStreaming: false,
  setInput: (input) => set({ input }),
  setRouterMode: (routerMode) => set({ routerMode }),
  setManualModelId: (manualModelId) => set({ manualModelId }),
  setPrivacyModeLocalOnly: (privacyModeLocalOnly) => set({ privacyModeLocalOnly }),
  setTaskKind: (taskKind) => set({ taskKind }),

  sendMessage: async () => {
    const { input, routerMode, manualModelId, privacyModeLocalOnly, taskKind, messages } = get();
    if (!input.trim()) return;

    const selectedModel =
      routerMode === 'manual' && manualModelId
        ? manualModelId
        : routeModel({
            task: taskKind,
            preferLowLatency: true,
            preferLowCost: true,
            privacyModeLocalOnly,
          })?.id ?? 'unknown-model';

    const userMessage: Message = { id: id(), role: 'user', text: input };
    const assistantMessage: Message = { id: id(), role: 'assistant', text: '', model: selectedModel };

    set({
      input: '',
      isStreaming: true,
      messages: [...messages, userMessage, assistantMessage],
    });

    await streamMockResponse(input, (event) => {
      if (event.event === 'token') {
        set((state) => {
          const updated = [...state.messages];
          const last = updated[updated.length - 1];
          if (last?.role === 'assistant') {
            last.text += event.token;
          }
          return { messages: updated };
        });
      }

      if (event.event === 'usage') {
        set((state) => {
          const updated = [...state.messages];
          const last = updated[updated.length - 1];
          if (last?.role === 'assistant') {
            last.usage = event.usage;
          }
          return { messages: updated };
        });
      }

      if (event.event === 'final' || event.event === 'error') {
        set({ isStreaming: false });
      }
    });
  },
}));
