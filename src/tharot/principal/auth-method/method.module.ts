import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { MethodService } from './infraestructura/servicios/method.service';
import { MethodController } from './infraestructura/controladores/method.controller';
import { SeedService } from './infraestructura/seeders/method.seed.service';
import config from '../../../config';
import { Method } from './infraestructura/modelos/method.model';
import { ConfigType } from '@nestjs/config';
@Module({
  imports: [
    TypeOrmModule.forFeature([Method]),
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
  controllers: [MethodController],
  providers: [MethodService, SeedService],
  exports:[MethodService]
})
export class MethodModule {
  constructor(private readonly seedService: SeedService) {}
  
  async onModuleInit(): Promise<void> {
    await this.seedService.run();
  }
}
