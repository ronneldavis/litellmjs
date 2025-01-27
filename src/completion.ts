import { getHandler } from './handlers/getHandler';
import {
  Handler,
  HandlerParams,
  HandlerParamsNotStreaming,
  HandlerParamsStreaming,
  Result,
  ResultNotStreaming,
  ResultStreaming,
} from './types';
import { AnthropicHandler } from './handlers/anthropic';
import { CohereHandler } from './handlers/cohere';
import { OllamaHandler } from './handlers/ollama';
import { OpenAIHandler } from './handlers/openai';
import { AI21Handler } from './handlers/ai21';
import { ReplicateHandler } from './handlers/replicate';

export const MODEL_HANDLER_MAPPINGS: Record<string, Handler> = {
  'claude-2': AnthropicHandler,
  'gpt-': OpenAIHandler,
  command: CohereHandler,
  'ollama/': OllamaHandler,
  'j2-': AI21Handler,
  'replicate/': ReplicateHandler,
};

export async function completion(
  params: HandlerParamsNotStreaming,
): Promise<ResultNotStreaming>;

export async function completion(
  params: HandlerParamsStreaming,
): Promise<ResultStreaming>;

export async function completion(params: HandlerParams): Promise<Result>;

export async function completion(params: HandlerParams): Promise<Result> {
  const handler = getHandler(params.model, MODEL_HANDLER_MAPPINGS);

  if (!handler) {
    throw new Error(
      `Model: ${params.model} not supported. Cannot find a handler.`,
    );
  }

  return handler(params);
}
