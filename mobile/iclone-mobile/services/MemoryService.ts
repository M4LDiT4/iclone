import ChatModel from "@/data/database/models/chatModel";
import { MemoryDBRepository } from "./localDB/memoryDBRepository";


interface MemoryServiceProps {
  memoryRepository: MemoryDBRepository
}

export class MemoryService {
  memoryRepository: MemoryDBRepository;

  constructor (props: MemoryServiceProps){
    this.memoryRepository = props.memoryRepository
  }

  async getMemoriesByTagId(tagId: string, {page, limit}:{page?: number, limit?: number}) {
    // implement pagination here
    return this.memoryRepository.getMemoryByTag(tagId, page, limit);
  }
  
  async getOngoingChats(): Promise<ChatModel[]> {
    return this.memoryRepository.getOngoingChats();
  }
}