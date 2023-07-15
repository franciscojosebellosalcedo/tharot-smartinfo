import { Module } from '@nestjs/common';
import { ConfigType } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Form } from "./infraestructura/modelos/form.model";
import { campo } from "./infraestructura/modelos/campo.model";
import { JwtModule } from "@nestjs/jwt";
import { FormController } from './infraestructura/controlador/form.controller';
import { CampoService } from './infraestructura/servicios/campo.service';
import { FormService } from './infraestructura/servicios/form.service';
import config from "../../../config";
import { SqlService } from '../../sql/infraestructura/servicios/sql.service';
import { MenuModule } from '../../principal/menu/menu.module';
import { RolModule } from '../../principal/rol/rol.module';
import { MenuRolModule } from '../../principal/menu_rol/menu_rol.module';
import { CustomersModule } from '../../principal/customers/customers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Form, campo]),
    JwtModule.registerAsync({
      inject: [config.KEY],
      useFactory: async (configServie: ConfigType<typeof config>) => {
        return {
          secret: configServie.secret_key,
          signOptions: { expiresIn: "3600s" },
        };
      },
    })
    ,MenuModule,RolModule,MenuRolModule,CustomersModule
  ],
  providers: [CampoService, FormService,SqlService],
  controllers: [FormController]
})
export class FormModule {}
