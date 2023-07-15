//servicios, casos de usos de usuaio
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";

import { AuthService } from "../servicios/auth.service";
import { UserService } from "../servicios/user.service";
import { UserCasoUso } from "../../aplicacion/user.caso";
//strategia locar de usurio (login)
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, "local") {
  private authCasoUso: UserCasoUso;
  constructor(readonly authService: AuthService, readonly userService:UserService) { 
    super();
    this.authCasoUso = new UserCasoUso(userService, authService);
  }
  //se valida el usuario
  async validate(email: string, pass: string){
    
    const user = await this.authCasoUso.validate(email, pass);

    if (!user) {
      throw new UnauthorizedException("Unauthorized User");
    }
    
    return true;
  }
}
