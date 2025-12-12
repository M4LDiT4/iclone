import { LocalDBError } from "@/core/errors/LocalDBError";
import { TagModel } from "@/data/database/models/tagModel";
import { Database } from "@nozbe/watermelondb";

interface TagDBRepositoryProps {
  database: Database
}

export default class TagDBRepository{
  database: Database;

  constructor(props: TagDBRepositoryProps){
    this.database = props.database;
  }

  async updateTag(
    {
      iconName,
      iconLibrary,
      tagId
    }: {
      iconName: string,
      iconLibrary: string,
      tagId: string
    }
  ){
    try{
      this.database.write( async () => {
        const tag = this.database.get<TagModel>(TagModel.table).find(tagId);

        (await tag).update((record) => {
          record.iconName = iconName,
          record.iconLibrary = iconLibrary
        });
      });
    }catch(err){
      console.error(`Failed to update tag`);
      throw new LocalDBError(`Failed to update tag`);
    }
  }

  async getTags(): Promise<TagModel[]>{
    // maybe paginate this
    const tagCollection = this.database.get<TagModel>(TagModel.table);
    const response = await tagCollection.query().fetch();
    return response;
  }
}