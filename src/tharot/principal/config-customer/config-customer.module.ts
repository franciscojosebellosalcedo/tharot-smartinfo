import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CustomerConfigService } from "./infraestructura/servicios/customer_config.service";
import { CustomersConfigModel } from "./infraestructura/modelos/customer_config.model";
import { JwtModule } from "@nestjs/jwt";
import config from "../../../config";
import { ConfigType } from "@nestjs/config";
import { CustomerConfigSeedService } from './infraestructura/seeds/customer_config_seed.service';
import { CustomerConfigController } from './infraestructura/controladores/customer_config.controller';
import { CustomersModule } from "../customers/customers.module";
@Module({
  imports:[
    TypeOrmModule.forFeature([CustomersConfigModel]),
    JwtModule.registerAsync({
      inject: [config.KEY],
      useFactory: async (configServie: ConfigType<typeof config>) => {
        return {
          secret: configServie.secret_key,
          signOptions: { expiresIn: "3600s" },
        };
      },
    }),CustomersModule ],
  providers: [CustomerConfigService, CustomerConfigSeedService],
  controllers: [CustomerConfigController],
})
export class ConfigCustomerModule {}
