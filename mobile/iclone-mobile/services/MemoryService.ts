import { MemoryDBRepository } from "./localDB/temp";

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
}