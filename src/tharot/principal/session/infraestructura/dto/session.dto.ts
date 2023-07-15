import { ApiProperty } from "@nestjs/swagger";
import {  IsJWT, IsNotEmpty, IsObject, IsString } from "class-validator";
import { sessionData } from "../../../user/dominio/entities/user.entity";

export class SessionCreateDto{

    @IsString({message:"token debe de ser un string"})
    @IsNotEmpty({message:"token no debe de estar vacio"})
    @IsJWT({message:"token debe de ser un jwt"})
    @ApiProperty({description:"token es jwt que guarda informacion del usuario"})
    token: string;

    @ApiProperty({
    description: "Ingresar el email del usuario",
    example: {
        "ip_device": "150.25.1.2",
        "name_device": "windows",
        "name_country": "colombia",
        "city": "cartagena",
        "region": "norte"
    },
    })
    
    @IsObject()
    session: sessionData;
}

export class VerifyNewSessionDto{
    @IsString({message:"ip_device debe de ser un string (cadena de texto)"})
    @IsNotEmpty({message:"ip_device no debe de estar vacio"})
    @ApiProperty({description:"ip_device es la ip del dispositivo en el que va a iniciar sesión"})
    ip_device:string;
}