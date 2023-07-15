import { CreateTokenDto, UpdateTokenDto } from "../../infraestructura/dto/token.dto";
import { TokenData } from "../valueobject/token.value";

export interface InterfaceRepositoryToken{
    createToken(newToken:CreateTokenDto):Promise<TokenData | null>
    deleteToken(tokenId:number):Promise<TokenData | null>
    updateToken(tokenId:number,newData:UpdateTokenDto):Promise<TokenData | null>
    getAllTokens():Promise<TokenData[] | null>
    getTokenById(tokenId:number):Promise<TokenData | null>
}