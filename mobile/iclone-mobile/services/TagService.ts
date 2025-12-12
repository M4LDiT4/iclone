import { TagServiceError } from "@/core/errors/TagServiceError";
import DeepSeekClient, { DeepSeekMessageStructure } from "@/domain/llm/deepSeek/model";
import TagDBRepository from "./localDB/TagDBRepository";

type IconMetaData = {
  iconName: string,
  iconLibrary: string
}

interface TagServiceProps {
  tagRepository: TagDBRepository,
  llmModel: DeepSeekClient
}
export default class TagService{
  tagRepository: TagDBRepository;
  llmModel : DeepSeekClient;

  constructor(props: TagServiceProps){
    this.tagRepository = props.tagRepository;
    this.llmModel = props.llmModel;
  }

  async generateIconMetadata({
    tagName,
    tagIconLibrary,
    tagIconName
  } :{
    tagName: string, 
    tagIconLibrary? :string,
    tagIconName?: string
  }): Promise<IconMetaData>
  {
    const systemPrompt = `
      You are tasked with suggesting an icon for a tag in a React Native application.

      Requirements:
      - Output must be a JSON object that begins with '{' and ends with '}'.
      - The JSON must contain exactly these fields:
        "library": "<React Native Vector Icons library>",
        "name": "<icon name from that library>"
      - Choose the icon based on the tag title or narrative: "${tagName}".
      - The icon library must be one of the supported sets in React Native Vector Icons:
        AntDesign, Entypo, EvilIcons, Feather, FontAwesome, FontAwesome5, Foundation,
        Ionicons, MaterialIcons, MaterialCommunityIcons, Octicons, SimpleLineIcons, Zocial.
      - The icon name must exactly match the icon name in the chosen library (e.g., "ellipsis-horizontal").
      - If values are provided (library="${tagIconLibrary}", name="${tagIconName}") but they are erroneous,
        invalid, or cause errors when rendering, IGNORE them and generate a new valid library/name pair instead.

      Example valid output:
      {
        "library": "Ionicons",
        "name": "chatbubble-ellipses"
      }
    `;

    const messages: DeepSeekMessageStructure[] = [
      {role: 'system', content: systemPrompt}
    ]
    const response = await this.llmModel.call(messages);
    
    const parsedResponse = JSON.parse(response);

    if(typeof parsedResponse === 'object'
      && parsedResponse.library
      && typeof parsedResponse.library === 'string'
      && parsedResponse.name
      && typeof parsedResponse.name === 'string' 
    ){
      const typedResponse: IconMetaData = {
        iconLibrary: parsedResponse.library,
        iconName: parsedResponse.name
      }
      return typedResponse;
    }
    console.log(`Response received does not have library and name fields`);
    throw new TagServiceError('Failed to generate icon metadata');
  }

  async generateAndSaveIconMetadata(
  {
    tagName,
    tagIconLibrary,
    tagIconName,
    tagId
  } :{
    tagId: string,
    tagName: string, 
    tagIconLibrary? :string,
    tagIconName?: string,
  }) {
    const iconMetaData = await this.generateIconMetadata({
      tagName,
      tagIconLibrary,
      tagIconName
    });

    await this.tagRepository.updateTag({
      iconName: iconMetaData.iconName,
      iconLibrary: iconMetaData.iconLibrary,
      tagId
    });

    // return metadata so that we can display it on the ui
    return iconMetaData;
  }
}