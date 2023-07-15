//servicios necesarios ,controladores , estrategias etc para que el modulo de user funcione correctamente
import { Module } from "@nestjs/common"; 
import { ConfigType } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import config from "src/config";
import { UserModule } from "../user/user.module";
import { DashboardController } from "./infraestructura/controladores/dashboard.controller";
import { ColumnModel } from "./infraestructura/modelos/column.model";
import { DashboardModel } from "./infraestructura/modelos/dashboard.model";
import { WidgetModel } from "./infraestructura/modelos/widget.model";
import { ColumnService } from "./infraestructura/servicios/column.service";
import { DashboardService } from "./infraestructura/servicios/dashboard.service";
import { WidgetService } from "./infraestructura/servicios/widget.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([DashboardModel,ColumnModel,WidgetModel]),
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
  controllers: [DashboardController],
  providers: [DashboardService,ColumnService,WidgetService],
  exports: [DashboardService,ColumnService,WidgetService]
})
export class DashboardModule {
}
