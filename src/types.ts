export type Role = 'user' | 'assistant' | 'system';

export type ModelProvider =
  | 'openai'
  | 'anthropic'
  | 'deepseek'
  | 'qwen'
  | 'mistral'
  | 'llama-local';

export type ModelProfile = {
  id: string;
  provider: ModelProvider;
  displayName: string;
  supportsVision: boolean;
  supportsDocs: boolean;
  supportsOcrCleanup: boolean;
  avgLatencyMs: number;
  qualityScore: number;
  costPer1kTokensUsd: number;
  freeTierLikely: boolean;
};

export type Message = {
  id: string;
  role: Role;
  text: string;
  model?: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
    estimatedUsd: number;
  };
};

export type RouterMode = 'auto' | 'manual';

export type TaskKind = 'chat' | 'vision' | 'ocr-cleanup' | 'document-qa';
