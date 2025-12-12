import ComponentStatus from "@/core/types/componentStatusType";
import database from "@/data/database/index.native";
import { TagModel } from "@/data/database/models/tagModel";
import DeepSeekClient from "@/domain/llm/deepSeek/model";
import TagDBRepository from "@/services/localDB/TagDBRepository";
import TagService from "@/services/TagService";
import { useEffect, useState } from "react"

export const useMemoryListViewModel = (
) => {
  const [tagService, setTagService] = useState<TagService|null> ();
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

  return {
    tagList,
    componentStatus,
    tagService
  }
}