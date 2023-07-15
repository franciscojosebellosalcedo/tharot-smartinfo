import { Module } from '@nestjs/common';
import { FacebookController } from './infraestructura/controladores/facebook.controller';
import { FacebookService } from './infraestructura/servicios/facebook.service';
import { ConfigModule, ConfigType } from "@nestjs/config";
import config from "../../config";

@Module({
  imports: [ConfigModule.forRoot({
    load: [config],
  }),],
  controllers: [FacebookController],
  providers: [FacebookService]
})
export class FacebookModule {}
