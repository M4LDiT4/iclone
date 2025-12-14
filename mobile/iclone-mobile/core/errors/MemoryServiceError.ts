export default class MemoryServiceError extends Error {
  constructor(message: string){
    super(message);
    this.name = "MemoryServiceError";

    if(Error.captureStackTrace){
      Error.captureStackTrace(this, MemoryServiceError);
    }
  }
}