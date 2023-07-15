import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { notificationEntity } from "../../dominio/entities/notification.entity";

export class CreateNotificationDto implements notificationEntity{
    @IsNumber()
    @IsNotEmpty({message:"user_id no debe de estar vacio"})
    @ApiProperty({description:"user_id es el id del usuario que efectuó la notificación",example:1,required:true})
    user_id: number;

    @IsString({message:"title debe de ser un string (texto)"})
    @IsNotEmpty({message:"title no debe de estar vacio"})
    @ApiProperty({description:"title es el titulo de la notificación",example:"Usuarios",required:true})
    title: string;

    @IsString({message:"description debe de ser un string"})
    @IsNotEmpty({message:"description no debe de estar vacio"})
    @ApiProperty({description:"description sera la descripción de la notificación que se genera"})
    description: string;

    @IsString({message:"type_notification debe de ser un string"})
    @IsNotEmpty({message:"type_notification no debe de estar vacio"})
    @ApiProperty({description:"type_notification será el tipo de la notificación que se genera"})
    type_notification: string;
}