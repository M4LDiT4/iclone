import { useAuth } from "@/core/contexts/authContext";
import ComponentStatus from "@/core/types/componentStatusType";
import database from "@/data/database/index.native";
import { TagModel } from "@/data/database/models/tagModel";
import DeepSeekClient from "@/domain/llm/deepSeek/model";
import ChatRepository from "@/services/localDB/ChatRepository";
import { ChatTagRepository } from "@/services/localDB/ChatTagRepository";
import TagDBRepository from "@/services/localDB/TagDBRepository";
import { MemoryService } from "@/services/MemoryService";
import TagService from "@/services/TagService";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react"

export const useMemoryListViewModel = (
) => {
  const auth = useAuth();

  const [tagService, setTagService] = useState<TagService|null> ();
  const [memoryService, setMemoryService] = useState<MemoryService | null>();
  const [tagList, setTagList] = useState<TagModel[]>([]);
  const [componentStatus, setComponentStatus] = useState<ComponentStatus>('idle');
  

  useEffect(() => {
    const initialize = async () => {
      const apiKey = process.env.EXPO_PUBLIC_DEEP_SEEK_API_KEY!;
      const model = new DeepSeekClient(apiKey);
      const tagRepository = new TagDBRepository({database: database})

      const newTagService = new TagService({
        llmModel: model,
        tagRepository
      });
      const chatRepo = new ChatRepository({database: database, userId: auth?.user?.uid!});
      const chatTagRepo = new ChatTagRepository(database);
      const newMemoryService = new MemoryService({chatRepository: chatRepo, chatTagRepository: chatTagRepo});
      setMemoryService(newMemoryService);
      
      setTagService(newTagService)
    }

    initialize();
  }, []);

  useEffect(() => {
    if(!tagService) return;
    let isMounted =true;
    const load = async () =>{
      try{
        setComponentStatus('initializing');
        const tags = await tagService.getTags();
        console.log(`tags count: ${tags.length}`);
        if(isMounted) setTagList(tags);
      }catch(err){
        console.error(`Failed to fetch tags: ${err}`);
      }finally{
        if(isMounted) setComponentStatus('idle');
      }
    }
    load();
    return () => {isMounted = false;}
  }, [tagService]);

  useFocusEffect(
    useCallback(() => {
      // do not execute anything when
      // service is null
      if(!tagService) return;
      let isMounted =true;
      const load = async () =>{
        try{
          setComponentStatus('initializing');
          const tags = await tagService.getTags();
          console.log(`tags count: ${tags.length}`);
          if(isMounted) setTagList(tags);
        }catch(err){
          console.error(`Failed to fetch tags: ${err}`);
        }finally{
          if(isMounted) setComponentStatus('idle');
        }
      }
      load();
      console.info(`Loaded the memoryList screen onfocus`)
    }, [])
  )

  return {
    tagList,
    componentStatus,
    tagService,
    memoryService,
  }
}