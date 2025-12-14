export class TagServiceError extends Error{
  constructor(message: string, public cause?: unknown){
    super(message);
    this.name = 'TagServiceError';
  }
}