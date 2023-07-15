//modulos , estrategias creadas para incorporarlas en el modulo central de la app (AppModule)
import { Module } from "@nestjs/common";
import { UserModule } from "./tharot/principal/user/user.module";
import { DatabaseModule } from "./database/database.module";
import { ConfigModule, ConfigType } from "@nestjs/config";
import { RolModule } from "./tharot/principal/rol/rol.module";
import { ApiKeysService } from "./global/infraestructura/servicios/apikeys.service";
import { ApiKeyRepository } from "./global/dominio/repository/apiKeys.respository";
import { ApiKeysStrategy } from "./global/infraestructura/strategy/apiKeys.strategy";
import { ApiKeyGuard } from "./global/dominio/guards/apiKeys.guard";
import { JwtAuthGuard } from "./global/dominio/guards/jwt.guard";
import { JwtModule } from "@nestjs/jwt";
import { MethodModule } from './tharot/principal/auth-method/method.module';
import { MethodCustomerModule } from './tharot/principal/method-customer/method-customer.module';
import { TokenModule } from './tharot/principal/token/token.module';
import { CustomersModule } from './tharot/principal/customers/customers.module';
import { FormularioModule } from './tharot/formularios/formulario.module';
import { GlobalModule } from './global/global.module';
import config from './config';
import { SessionModule } from "./tharot/principal/session/session.module";
import { ConfigCustomerModule } from './tharot/principal/config-customer/config-customer.module';
import { SqlModule } from "./tharot/sql/sql.module"
import { MenuRolModule } from './tharot/principal/menu_rol/menu_rol.module';
import { MenuModule } from './tharot/principal/menu/menu.module';
import { DashboardModule } from "./tharot/principal/dashboard/dashboard.module";
import { NotificationModule } from "./tharot/principal/notificaciones/notification.module";
import { FacebookModule } from './tharot/facebook/facebook.module';
import { ModuloModule } from "./tharot/principal/modulos/modulo.module";
//AppModule, modulo central de la aplicación este contiene los demas modulos 
@Module({
  imports: [
    SqlModule,
    DatabaseModule,
    UserModule,
    RolModule,
    DashboardModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    //registro de jwt   
    JwtModule.registerAsync({
      inject: [config.KEY],
      useFactory: async (configServie: ConfigType<typeof config>) => {
        return {
          secret: configServie.secret_key,
          //signOptions: { expiresIn: "3600s" },
        };
      },
    }), MethodModule, MethodCustomerModule, CustomersModule, TokenModule, FormularioModule, SessionModule,
    ConfigCustomerModule, GlobalModule, MenuRolModule, MenuModule, NotificationModule, DashboardModule, 
    FacebookModule,ModuloModule],
  controllers: [],
  providers: [ApiKeysService, ApiKeyRepository, ApiKeysStrategy, ApiKeyGuard, JwtAuthGuard],
  exports: [ApiKeysService, ApiKeyRepository, ApiKeysStrategy, ApiKeyGuard, JwtAuthGuard],
})
export class AppModule { }
