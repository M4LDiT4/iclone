import ChatModel from "@/data/database/models/chatModel";
import { MemoryDBRepository } from "./localDB/memoryDBRepository";
import { SummaryServiceError } from "@/core/errors/SummaryServiceError";
import { ChatTagRepository } from "./localDB/ChatTagRepository";
import MemoryServiceError from "@/core/errors/MemoryServiceError";


interface MemoryServiceProps {
  memoryRepository: MemoryDBRepository
  chatTagRepository: ChatTagRepository
}

export class MemoryService {
  memoryRepository: MemoryDBRepository;
  chatTagRepository: ChatTagRepository;

  constructor (props: MemoryServiceProps){
    this.memoryRepository = props.memoryRepository;
    this.chatTagRepository = props.chatTagRepository;
  }

  async getMemoriesByTagId(tagId: string, {page, limit}:{page?: number, limit?: number}) {
    // implement pagination here
    return this.memoryRepository.getMemoryByTag(tagId, page, limit);
  }
  
  async getOngoingChats(): Promise<ChatModel[]> {
    return this.memoryRepository.getOngoingChats();
  }

  async getSavedNarrativeAsHighLevelSummary(chatId: string) {
    try{
      const narrative = await this.memoryRepository.getChatById(chatId);
      // 
      if(narrative.status === 'ongoing'){
        throw new SummaryServiceError(`Selected chat does not have a saved narrative`);
      }
      const tagModels = await this.chatTagRepository.getTagsByChatId(chatId);
      
      // const summary: HighLevelChatSummary = {
      //   tag: [...tagModels.map((t) => t.name)],
      //   title: narrative.title!,
      //   summary: narrative.narrative!,


      // }
    }catch(err){
      console.error(`Failed to get the saved narrative and parse it as type HighLevelSummary: ${err}`);
      throw new MemoryServiceError(`Faile to get the saved narrative`)
    }
  }
}