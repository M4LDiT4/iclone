import { TagModel } from "@/data/database/models/tagModel";
import TagService from "@/services/TagService";
import { useEffect, useState } from "react"

export const useMemoryListViewModel = (
  tagService: TagService
) => {
  const [tagList, setTagList] = useState<TagModel[]>([]);

  useEffect(() => {
    const load = async () =>{
      
    }
  })
}