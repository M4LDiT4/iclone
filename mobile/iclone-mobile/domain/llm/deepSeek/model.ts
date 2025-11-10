import axios from 'axios';
class DeepSeekClient {
  private readonly apiKey: String; 
  private readonly baseUrl:string = 'https://api.deepseek.com/chat/completions';
  private readonly model = 'deepseek-chat';

  constructor (apiKey: string){
    this.apiKey = apiKey;
  }

  constructPrompt(): String{
    return "Prompt";
  } 

  public async call(content:String):Promise<string> {
    try{
      const headers = {
        'Content-Type': "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      }

      const body = {
        "model":this.model,
        messages: content,
        stream: false

      }
      const response = await axios.post(
        this.baseUrl,
        body,
        {headers}
      )
      return response.data;
    }catch(err: any){
    }
    return "response";
  }
}

export default DeepSeekClient;