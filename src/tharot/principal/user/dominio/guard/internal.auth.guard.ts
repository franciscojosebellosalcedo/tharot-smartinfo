import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { Observable } from "rxjs";
import { Request } from "express";

import config from "../../../../../config";

@Injectable()
export class InternalAuthGuard implements CanActivate {
  constructor(@Inject(config.KEY) private configService: ConfigType<typeof config>) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<Request>();

    const authHeader = req.header("token");
    const val = authHeader === this.configService.apikey;
    if (!val) {
      throw new UnauthorizedException("Bad request");
    }
    return val;
  }
}
