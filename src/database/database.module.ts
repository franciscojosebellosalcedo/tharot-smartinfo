//importacion de modulos necesarios para la configuración de la conexion a la base de datos
import { Module, Global } from "@nestjs/common";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { ConfigModule, ConfigType } from "@nestjs/config";
import config from "../config";
//modulo de la base de datos 
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
    //configuracion de la base de datos para la conexion
    TypeOrmModule.forRootAsync({
      inject: [config.KEY],
      useFactory: async (configServie: ConfigType<typeof config>) => {
        //propiedades para la conexion
        return {
          type: configServie.database.type,
          host: configServie.database.host,
          port: configServie.database.port,
          username: configServie.database.username,
          password: configServie.database.password,
          database: configServie.database.database,
          autoLoadEntities: true,
          synchronize: true,
        } as TypeOrmModuleOptions;
      },
    }),    
  ],
  exports: [ConfigModule, TypeOrmModule],
})
export class DatabaseModule {}
