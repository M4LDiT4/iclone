interface ConversationDataProps{
  id: string,
  chatId: string,
  systemMessage: string,
  userMessage?: string
}
class ConversationData {
  id: string;
  chatId: string;
  userMessage?:string
  systemMessage: string;
  constructor(props:ConversationDataProps){
    this.id = props.id;
    this.systemMessage = props.systemMessage,
    this.chatId = props.chatId,
    this.userMessage = props.userMessage
  }
}

export default ConversationData