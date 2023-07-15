import { ApiProperty } from "@nestjs/swagger";
import {  IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { updateConfigCustomer } from "../../dominio/entities/config_custom.entity";

//dto de customer
//dto de datos para crear un customer
export class CreateCustomerConfigDto {
    @IsNumber()
    @IsOptional()
    @IsNotEmpty()
    id?:number;

    @IsInt({message:"Tipo de dato incorrecto"})
    @IsNotEmpty({message:"Esquema de datos inválido"})
    @ApiProperty({description:"Id de la empresa a la que pertenece la configuración"})
    customer_id: number;

    @IsString({message:"Tipo de dato incorrecto"})
    @IsNotEmpty({message:"Esquema de datos inválido"})
    @ApiProperty({description:"Color primario de la aplicación en formato hexadecimal"})
    @IsOptional()
    primary_color?: string;

    @IsString({message:"Tipo de dato incorrecto"})
    @IsNotEmpty({message:"Esquema de datos inválido"})
    @ApiProperty({description:"Color secundario de la aplicación en formato hexadecimal"})
    @IsOptional()
    secondary_color?: string;

    @IsBoolean({message:"dark_mode debe de ser un boolean"})
    @IsNotEmpty()
    @ApiProperty({description:"dark_mode es el modo de thema en la que esta la aplicación"})
    @IsOptional()
    dark_mode?: boolean;

    @IsString({message:"Tipo de dato incorrecto"})
    @IsNotEmpty({message:"Esquema de datos inválido"})
    @ApiProperty({description:"Color terceario de la aplicación en formato hexadecimal"})
    @IsOptional()
    tertiary_color?: string;

    // @IsBase64()
    // @IsNotEmpty({message:"Esquema de datos inválido"})
    // @ApiProperty({description:"Icono de la empresa para el menú"})
    // @IsOptional()
    // icon_menu?: string;
    
    @IsString({message:"Tipo de dato incorrecto de font_family"})
    @IsNotEmpty({message:"Esquema de datos inválido"})
    @ApiProperty({description:"Familia de la fuente"})
    @IsOptional()
    font_family?: string;

    @IsNumber()
    @IsOptional()
    @IsNotEmpty()
    status?:number;

}
//dto para editar un customer
export class UpdateCustomerConfigDto implements updateConfigCustomer{
    @IsString({message:"Tipo de dato incorrecto"})
    @IsNotEmpty({message:"Esquema de datos inválido"})
    @ApiProperty({description:"Color primario de la aplicación en formato hexadecimal"})
    @IsOptional()
    primary_color?: string;

    @IsString({message:"Tipo de dato incorrecto"})
    @IsNotEmpty({message:"Esquema de datos inválido"})
    @ApiProperty({description:"Color secundario de la aplicación en formato hexadecimal"})
    @IsOptional()
    secondary_color?: string;

    @IsString({message:"Tipo de dato incorrecto"})
    @IsNotEmpty({message:"Esquema de datos inválido"})
    @ApiProperty({description:"Color secundario de la aplicación en formato hexadecimal"})
    @IsOptional()
    tertiary_color?: string;

    @IsBoolean()
    @IsNotEmpty()
    @ApiProperty({description:"dark_mode es el modo de thema en el que se encuentra"})
    @IsOptional()
    dark_mode?: boolean;

    // @ApiProperty({ type: 'string', format: 'binary' })
    // @Type(() => Object)
    // @IsDefined()
    // @ApiProperty({description:"Icono de la empresa para el menú"})
    // @IsOptional()
    // icon_menu?: string;
    
    @IsString({message:"Tipo de dato incorrecto"})
    @IsNotEmpty({message:"Esquema de datos inválido"})
    @ApiProperty({description:"Familia de la fuente"})
    @IsOptional()
    font_family?: string;
}


