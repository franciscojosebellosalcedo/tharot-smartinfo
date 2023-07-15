import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallBack } from "passport-google-oauth20";
import { Injectable } from "@nestjs/common";

//estrategia de autenticacion con google (login)
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor() {
    //credenciales de la api de google
    super({
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
      scope: ["email", "profile"]
    });
  }
//valida la autenticacion del usuario 
  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallBack): Promise<any> {
    // este es el perfil del usuario con toda la informacion de google
    const { name, emails, photos } = profile;// desestructutacion de algunos datos de este
    //se esta obteniendo algunos datos del perfil del usuario que proporciona
    const user = {
      user: profile,
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value, 
      accessToken
    }
    done(null, user);
  }

}