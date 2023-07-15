import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TokenController } from "./infraestructura/controladores/token.controller";
import { TokenModel } from "./infraestructura/modelos/token.model";
import { TokenService } from "./infraestructura/servicios/token.service";

@Module({
    imports:[TypeOrmModule.forFeature([TokenModel])],
    providers:[TokenService],
    controllers:[TokenController],
    exports:[]
})
export class TokenModule{}