import { Module } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import config from "../../../config";
import { JwtModule } from "@nestjs/jwt";
import { NotificationModel } from "./infraestructura/modelos/notification.model";
import { NotificationController } from "./infraestructura/controladores/notification.controller";
import { NotificationService } from "./infraestructura/servicios/notification.service";
import { UserModule } from "../user/user.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationModel]),
    JwtModule.registerAsync({
      inject: [config.KEY],
      useFactory: async (configServie: ConfigType<typeof config>) => {
        return {
          secret: configServie.secret_key,
          signOptions: { expiresIn: "3600s" },
        };
      },
    }),
    UserModule
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {
}
