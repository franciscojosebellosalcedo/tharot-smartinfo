import { Injectable } from "@nestjs/common";
import { ApiKeyEntity } from "../entities/apiKey.entity";

@Injectable()
export class ApiKeyRepository {
  private keys: ApiKeyEntity[] = [
    {
      name: process.env.API_NAME,
      key: process.env.API_KEY_THAROT
    }
  ]

  findOne(key:string):ApiKeyEntity{
    return this.keys.find((k)=>k.key===key);
  }
}