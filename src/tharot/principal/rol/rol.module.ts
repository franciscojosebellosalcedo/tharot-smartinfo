import { Module } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RolService } from "./infraestructura/servicios/rol.service";
import { Rol } from "./infraestructura/modelos/rol.model";
import { RolController } from "./infraestructura/controladores/rol.controller";
import config from "../../../config";
import { JwtModule } from "@nestjs/jwt";
import { RolSeedService } from './infraestructura/seeders/rol.seed.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rol]),
    JwtModule.registerAsync({
      inject: [config.KEY],
      useFactory: async (configServie: ConfigType<typeof config>) => {
        return {
          secret: configServie.secret_key,
          signOptions: { expiresIn: "3600s" },
        };
      },
    }),
  ],
  controllers: [RolController],
  providers: [RolService, RolSeedService],
  exports: [RolService],
})
export class RolModule {
  constructor(private readonly seedService: RolSeedService) {}

  async onModuleInit(): Promise<void> {
    await this.seedService.run();
  }
}
