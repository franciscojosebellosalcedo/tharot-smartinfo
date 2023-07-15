import { ApiProperty, PartialType } from "@nestjs/swagger";
import {  IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

import { ConfigMailer, CreateDataMail } from '../../dominio/entities/mail.entity';

export class ConfigMailerDto implements ConfigMailer {
    @ApiProperty({
        description: "Smtp host desde donde se envia el correo",
        example: "smtp.gmail.com",
    })
    @IsString()
    @IsNotEmpty({ message: "Host no debe de estar vacio" })
    host: string;

    @ApiProperty({
        description: "Puerto designado para el envia de correo",
        example: 465,
    })
    @IsNumber()
    @IsNotEmpty({ message: "Puerto no debe de estar vacio" })
    port: number;

    @ApiProperty({
        description: "Secure definicion si la conexion por este puesto es segura o no, 1 es seguro 0 inseguro ",
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty({ message: "Secure no debe de estar vacio" })
    secure: number;

    @ApiProperty({
        description: "Correo que se usara como remitente",
        example: "tharot@gmail.com",
    })
    @IsString()
    @IsNotEmpty({ message: "correo no debe de estar vacio" })
    email: string;

    @ApiProperty({
        description: "Clave secreta proporcionada por el servidor de correo que utilizara.",
        example: "XdasRrxv2",
    })
    @IsString()
    @IsNotEmpty({ message: "secret no debe de estar vacio" })
    secret: string;
}

export class MailDto implements CreateDataMail {
    
    @ApiProperty({
        description: "Titulo del correo electronico",
        example: "Codigo de Verificacion",
    })
    @IsString()
    @IsNotEmpty({ message: "titulo no debe de estar vacio" })
    titulo: string;

    @ApiProperty({
        description: "Asunto del correo que se va a enviar",
        example: "Codigo",
    })
    @IsString()
    @IsNotEmpty({ message: "asunto no debe de estar vacio" })
    asunto: string;

    @ApiProperty({
        description: "cuerpo del correo correo",
        example: "Desarrollo de la tematica del correo",
    })
    @IsString()
    @IsNotEmpty({ message: "body no debe de estar vacio" })
    body: string;
}