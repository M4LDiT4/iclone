import { ContextNode } from "@/models/ContextNode";
import SlidingWindow from "./SlidingWindow";

class ContextQueue{
 window: SlidingWindow<ContextNode>;
 
 constructor(window:SlidingWindow<ContextNode>){
  this.window = window;
 }

 insertUserMessage(userMessage : string) : void{
  const messageNode = new ContextNode(userMessage, 'user' );
  this.window.push(messageNode);
 }

 insertSystemResponse(systemResponse: string): void{
  const messageNode = new ContextNode(systemResponse, 'system');
  this.window.push(messageNode);
 }

 async summarizeWindow(): Promise<string> {
  // TODO: create a summary 
  return "Summary";
 }
}