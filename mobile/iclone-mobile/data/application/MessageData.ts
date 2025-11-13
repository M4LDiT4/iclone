import SenderType from "@/domain/types/senderTypes";

interface MessageDataProps {
  id: string,
  chatId: string,
  content: string,
  sender: SenderType
}

class MessageData{
  id: string;
  chatId: string;
  content: string;
  sender: SenderType

  constructor(
    props: MessageDataProps
  ){
    this.id = props.id;
    this.chatId = props.chatId;
    this.content = props.content;
    this.sender = props.sender
  }
}

export default MessageData;