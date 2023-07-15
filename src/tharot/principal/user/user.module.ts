//servicios necesarios ,controladores , estrategias etc para que el modulo de user funcione correctamente
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserController } from "./infraestructura/controladores/user.controller";
import { AuthController } from "./infraestructura/controladores/auth.controller";
import { UserService } from "./infraestructura/servicios/user.service";
import { AuthService } from "./infraestructura/servicios/auth.service";
import { GlobalModule } from '../../../global/global.module';
import { GoogleStrategy } from "./infraestructura/strategy/google.strategy";
import { LocalStrategy } from "./infraestructura/strategy/local.strategy";
import { User } from "./infraestructura/modelos/user.model";
import { Auth } from "./infraestructura/modelos/auth.model";
import { JwtModule } from "@nestjs/jwt";
import { ConfigType } from "@nestjs/config";
import config from "../../../config";
import { VerifyCode } from "./infraestructura/modelos/verify_code.model";
import { RolModule } from "../rol/rol.module";
import { UserSeedService } from "./infraestructura/seeders/user.seed.service";
import { SessionModule } from '../session/session.module';
import { CustomersModule } from "../customers/customers.module";
import { MethodModule } from "../auth-method/method.module";
import { MethodCustomerModule } from "../method-customer/method-customer.module";
//modulo de usuario
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Auth, VerifyCode]),
    JwtModule.registerAsync({
      inject: [config.KEY],
      useFactory: async (configServie: ConfigType<typeof config>) => {
        return {
          secret: configServie.secret_key,
          signOptions: { expiresIn: "3600s" },
        };
      },
    }),
    RolModule,
    SessionModule,
    GlobalModule,
    CustomersModule,
    MethodModule,
    MethodCustomerModule
  ],
  controllers: [UserController, AuthController],
  providers: [
    AuthService,
    UserService,
    GoogleStrategy,
    LocalStrategy,
    UserSeedService,
  ],
  exports: [UserService, AuthService],
})
export class UserModule {
  constructor(private readonly seedService: UserSeedService) {}

  async onModuleInit(): Promise<void> {
    await this.seedService.run();
  }
}
