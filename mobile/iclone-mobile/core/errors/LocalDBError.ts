export class LocalDBError extends Error {
  constructor(message: string){
    super(message);
    this.name = "LocalDBError";

    if(Error.captureStackTrace){
      Error.captureStackTrace(this, LocalDBError);
    }
  }
}