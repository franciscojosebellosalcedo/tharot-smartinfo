import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { InterfaceRepositoryToken } from "../../dominio/repository/token.repository";
import { TokenData } from "../../dominio/valueobject/token.value";
import { CreateTokenDto, UpdateTokenDto } from "../dto/token.dto";
import { TokenModel } from "../modelos/token.model";


@Injectable()
export class TokenService implements InterfaceRepositoryToken {

  constructor(@InjectRepository(TokenModel) private _tokenRepository: Repository<TokenModel>) { }
  

  async createToken(newToken: CreateTokenDto): Promise<TokenData> {
    const tokenFound = await this._tokenRepository.findOne({ where: { user_id: newToken.user_id } });
    if (tokenFound) {
      return null;
    } else {
      const newTokenCreated = this._tokenRepository.create(newToken);
      const token = await this._tokenRepository.save(newTokenCreated);
      return token;
    }
  }

  async deleteToken(tokenId: number): Promise<TokenData | any> {
    const responseDeleted = await this._tokenRepository.delete(tokenId);
    return responseDeleted;
  }

  async updateToken(tokenId: number, newData: UpdateTokenDto): Promise<TokenData | any> {
    const responseUpdate = await this._tokenRepository.update(tokenId, newData);
    return responseUpdate;
  }

  async getAllTokens(): Promise<TokenData[]> {
    const tokens = await this._tokenRepository.find();
    return tokens;
  }


  async getTokenById(tokenId: number): Promise<TokenData> {
    const token = await this._tokenRepository.findOne({ where: { id: tokenId } });
    return token;
  }


}