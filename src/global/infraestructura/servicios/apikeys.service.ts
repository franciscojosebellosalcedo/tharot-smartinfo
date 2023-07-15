import { Injectable } from "@nestjs/common";
import { ApiKeyEntity } from "../../dominio/entities/apiKey.entity";
import { ApiKeyRepository } from "../../dominio/repository/apiKeys.respository";

@Injectable()
export class ApiKeysService{
    constructor(private apiKeyRepository:ApiKeyRepository){}

    findOne(key:string):ApiKeyEntity{
        return this.apiKeyRepository.findOne(key);
    }
}