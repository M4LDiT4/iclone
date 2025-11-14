export class LLMError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message);
    this.name = 'LLMError';
  }
}
