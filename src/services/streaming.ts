import { Message } from '../types';

export type StreamEvent =
  | { event: 'token'; token: string }
  | { event: 'usage'; usage: Message['usage'] }
  | { event: 'final' }
  | { event: 'error'; error: string };

export const streamMockResponse = async (
  prompt: string,
  onEvent: (event: StreamEvent) => void,
): Promise<void> => {
  const response = `Here is a production-ready response to: ${prompt}. This answer was streamed token by token to simulate SSE/WebSocket behavior.`;

  const tokens = response.split(' ');
  for (const token of tokens) {
    await new Promise((resolve) => setTimeout(resolve, 50));
    onEvent({ event: 'token', token: `${token} ` });
  }

  onEvent({
    event: 'usage',
    usage: {
      inputTokens: Math.ceil(prompt.length / 4),
      outputTokens: Math.ceil(response.length / 4),
      estimatedUsd: 0.0002,
    },
  });

  onEvent({ event: 'final' });
};
