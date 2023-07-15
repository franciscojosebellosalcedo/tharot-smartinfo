import { Module } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import config from "../../../config";
import { Session } from "./infraestructura/modelos/session.model";
import { SessionService } from "./infraestructura/servicios/session.service";

@Module({
    imports:[TypeOrmModule.forFeature([Session]),
    JwtModule.registerAsync({
      inject: [config.KEY],
      useFactory: async (configServie: ConfigType<typeof config>) => {
        return {
          secret: configServie.secret_key,
          signOptions: { expiresIn: "3600s" },
        };
      },
    })],
    providers:[SessionService],
    exports:[SessionService],
})
export class SessionModule{  
}