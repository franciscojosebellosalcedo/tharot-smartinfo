import { Module } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import config from "../../../config";
import { JwtModule } from "@nestjs/jwt";
import { ModuloModel } from "./infraestructura/modelos/modulo.model";
import { ModuloController } from "./infraestructura/controladores/modulo.controller";
import { ModuloService } from "./infraestructura/servicios/modulo.service";
import { ContractsModuloModel } from "./infraestructura/modelos/contracts_modulo.model";
import { ContractsModuloService } from "./infraestructura/servicios/contracts_modulo.service";
import { CustomersModule } from "../customers/customers.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([ModuloModel,ContractsModuloModel]),
    JwtModule.registerAsync({
      inject: [config.KEY],
      useFactory: async (configServie: ConfigType<typeof config>) => {
        return {
          secret: configServie.secret_key,
          signOptions: { expiresIn: "3600s" },
        };
      },
    }),
    CustomersModule
  ],
  controllers: [ModuloController],
  providers: [ModuloService,ContractsModuloService],
  exports: [ModuloService,ContractsModuloService],
})
export class ModuloModule {
}
