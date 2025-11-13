import MessageData from "@/data/application/MessageData";

export default function messageDataListToPromptConverter(messages: MessageData[]): string {
  return 'summary';
}