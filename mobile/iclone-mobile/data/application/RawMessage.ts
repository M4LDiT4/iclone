import SenderType from "@/domain/types/senderTypes";

interface RawMessageDataProps {
  chatId: string;
  content: string;
  sender: SenderType
}

class RawMessageData{
  chatId: string;
  content: string;
  sender: SenderType
  
  constructor(props:RawMessageDataProps){
    this.chatId = props.chatId;
    this.content = props.content;
    this.sender = props.sender
  }
}

export default RawMessageData;