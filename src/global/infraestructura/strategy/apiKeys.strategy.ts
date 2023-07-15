import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { HeaderAPIKeyStrategy } from "passport-headerapikey";
import { ApiKeyEntity } from "../../dominio/entities/apiKey.entity";
import { ApiKeysService } from "../servicios/apikeys.service";

@Injectable()
export class ApiKeysStrategy extends PassportStrategy(HeaderAPIKeyStrategy) {
  constructor(private apiKeyService: ApiKeysService) {
    super({
      header: "Authorization",
      prefix: "apiKey "

    }, false);
  }

  validate(key: string): ApiKeyEntity {
    const apiKey = this.apiKeyService.findOne(key);
    if (!apiKey) {
      throw new UnauthorizedException("No autorizado")
    } else {
      return apiKey;
    }
  }
}