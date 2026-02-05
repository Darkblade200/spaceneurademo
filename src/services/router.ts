import { modelCatalog } from './modelCatalog';
import { ModelProfile, TaskKind } from '../types';

export type RouterContext = {
  task: TaskKind;
  preferLowLatency: boolean;
  preferLowCost: boolean;
  privacyModeLocalOnly: boolean;
};

const isTaskCompatible = (model: ModelProfile, task: TaskKind): boolean => {
  if (task === 'vision') return model.supportsVision;
  if (task === 'ocr-cleanup') return model.supportsOcrCleanup;
  if (task === 'document-qa') return model.supportsDocs;
  return true;
};

const scoreModel = (model: ModelProfile, ctx: RouterContext): number => {
  const latencyWeight = ctx.preferLowLatency ? 0.35 : 0.2;
  const costWeight = ctx.preferLowCost ? 0.35 : 0.2;
  const qualityWeight = 0.45;

  const quality = model.qualityScore;
  const latency = 1 / Math.max(model.avgLatencyMs, 1);
  const cost = 1 / Math.max(model.costPer1kTokensUsd + 0.0001, 0.0001);

  return qualityWeight * quality + latencyWeight * latency * 800 + costWeight * cost * 0.001;
};

export const routeModel = (ctx: RouterContext): ModelProfile | undefined => {
  const candidates = modelCatalog
    .filter((m) => isTaskCompatible(m, ctx.task))
    .filter((m) => (ctx.privacyModeLocalOnly ? m.provider === 'llama-local' : true));

  return candidates.sort((a, b) => scoreModel(b, ctx) - scoreModel(a, ctx))[0];
};

export const topCandidates = (ctx: RouterContext, limit = 3): ModelProfile[] => {
  const candidates = modelCatalog
    .filter((m) => isTaskCompatible(m, ctx.task))
    .filter((m) => (ctx.privacyModeLocalOnly ? m.provider === 'llama-local' : true))
    .sort((a, b) => scoreModel(b, ctx) - scoreModel(a, ctx));

  return candidates.slice(0, limit);
};
