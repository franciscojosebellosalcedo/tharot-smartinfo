import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { McController } from './infraestructura/controladores/mc.controller';
import { McService } from './infraestructura/servicios/mc.service';
import { Mc } from './infraestructura/modelos/mc.model';
import config from '../../../config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Mc]),
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
  controllers: [McController],
  providers: [McService],
  exports:[McService]
})
export class MethodCustomerModule {}
