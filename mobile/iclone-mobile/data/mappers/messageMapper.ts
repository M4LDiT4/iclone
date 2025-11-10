import MessageData from "../application/MessageData"
import MessageModel from "../database/models/messageModel"


export const toMessageData = (model: MessageModel): MessageData => {
  return new MessageData({
    id: model.id,
    chatId: model.chatId,
    content: model.content,
    sender: model.sender
  })
}


export const toMessageModel = (data: MessageData) => ({
  chat_id: data.chatId,
  content: data.content,
  sender: data.sender,
})