import ChatModel from "@/data/database/models/chatModel";
import { SummaryServiceError } from "@/core/errors/SummaryServiceError";
import { ChatTagRepository } from "./localDB/ChatTagRepository";
import MemoryServiceError from "@/core/errors/MemoryServiceError";
import ChatRepository from "./localDB/ChatRepository";
import { HighLevelChatSummary } from "./SummaryService";


interface MemoryServiceProps {
  chatRepository: ChatRepository
  chatTagRepository: ChatTagRepository
}

export class MemoryService {
  chatRepository: ChatRepository
  chatTagRepository: ChatTagRepository;

  constructor (props: MemoryServiceProps){
    this.chatRepository = props.chatRepository;
    this.chatTagRepository = props.chatTagRepository;
  }

  async getMemoriesByTagId(tagId: string, {page, limit}:{page?: number, limit?: number}) {
    // implement pagination here
    return this.chatRepository.getChatByTag(tagId, page, limit);
  }
  
  async getOngoingChats(): Promise<ChatModel[]> {
    return this.chatRepository.getOngoingChats();
  }

  async getSavedNarrativeAsHighLevelSummary(chatId: string): Promise<HighLevelChatSummary> {
    try{
      const narrative = await this.chatRepository.getChatById(chatId);
      // 
      if(narrative.status === 'ongoing'){
        throw new SummaryServiceError(`Selected chat does not have a saved narrative`);
      }
      const tagModels = await this.chatTagRepository.getTagsByChatId(chatId);
      const summary: HighLevelChatSummary = {
        tag: [...tagModels.map((t) => t.name)],
        title: narrative.title!,
        summary: narrative.summary!,
        narrative: narrative.summary!,
        icon: {
          name: narrative.iconName!,
          library: narrative.iconLibrary!,
        }
      }

      return summary;
    }catch(err){
      console.error(`Failed to get the saved narrative and parse it as type HighLevelSummary: ${err}`);
      throw new MemoryServiceError(`Faile to get the saved narrative`)
    }
  }
}