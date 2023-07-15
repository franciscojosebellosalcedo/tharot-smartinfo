import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MethodModule } from "../auth-method/method.module";
import { MethodCustomerModule } from "../method-customer/method-customer.module";
import { JwtModule } from "@nestjs/jwt";
import { ConfigType } from "@nestjs/config";
import config from "../../../config";
import { CustomerController } from "./infraestructura/controladores/customers.controller";
import { CustomersModel } from "./infraestructura/modelos/customers.model";
import { CustomersService } from "./infraestructura/servicios/customer.service";
import { CustomerSeedService } from "./infraestructura/seeders/customer.seed.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomersModel]),
    JwtModule.registerAsync({
      inject: [config.KEY],
      useFactory: async (configServie: ConfigType<typeof config>) => {
        return {
          secret: configServie.secret_key,
          signOptions: { expiresIn: "3600s" },
        };
      },
    }),
    MethodModule,
    MethodCustomerModule,
  ],
  providers: [CustomersService, CustomerSeedService],
  controllers: [CustomerController],
  exports: [CustomersService],
})
export class CustomersModule {
  constructor(private readonly seedService: CustomerSeedService) {}

  async onModuleInit(): Promise<void> {
    await this.seedService.run();
  }
}
