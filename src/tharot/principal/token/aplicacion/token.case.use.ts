import { InterfaceTokenEntity } from "../dominio/entities/token.entity";
import { InterfaceRepositoryToken } from "../dominio/repository/token.repository";
import { UpdateTokenDto } from "../infraestructura/dto/token.dto";


export class  TokenCaseUse{

    constructor(private tokenRepository:InterfaceRepositoryToken){}

    async createToken(newToken:InterfaceTokenEntity){
       const tokenCreated=await this.tokenRepository.createToken(newToken);
       return  tokenCreated;
    }

    async getAllTokens(){
       const tokens= await this.tokenRepository.getAllTokens();
       if(tokens.length===0){
        return null;
       }
       return tokens;
    }

    async getTokenById(tokenId:number){
        const tokenFound= await this.tokenRepository.getTokenById(tokenId);
        if(!tokenFound){
            return null;
        }
        return  tokenFound;
    }

    async deleteToken(tokenId:number){
       const tokenDeleted= await this.tokenRepository.deleteToken(tokenId);
       if(tokenDeleted["affected"]===0) return false;
       return true;
    }

    async updateToken(tokenId:number,newData:UpdateTokenDto){
        const tokenUpdated=await this.tokenRepository.updateToken(tokenId,newData);
        if(tokenUpdated["affected"]===0) return false;
        return true;
    }

}