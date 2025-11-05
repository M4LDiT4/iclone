
export type ContextType = 'system' |'user'


export class ContextNode {
  content: string;
  type: ContextType;
  createdAt: Date;
  updatedAt: Date;

  constructor (content:string, type: ContextType){
    this.content = content;
    this.type = type;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  updateContent(newContent: string){
    this.content = newContent;
    this.updatedAt = new Date();
  }
}