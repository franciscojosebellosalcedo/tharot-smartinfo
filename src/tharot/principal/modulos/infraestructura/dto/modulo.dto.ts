import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { moduloEntity } from "../../dominio/entities/modulo.entity";

export class CreateModuloDto implements moduloEntity{
    @IsString({message:"name debe de ser un string (texto)"})
    @IsNotEmpty({message:"name no debe de estar vacio"})
    @ApiProperty({description:"name es el nombre del modulo"})
    name: string;

    @IsString({message:"description debe de ser un string (texto)"})
    @IsNotEmpty({message:"description no debe de estar vacio"})
    @ApiProperty({description:"description es el descripcion del modulo que esta disponible"})
    description: string;
}

export class UpdateModuloDto{
    @IsString({message:"name debe de ser un string (texto)"})
    @IsNotEmpty({message:"name no debe de estar vacio"})
    @ApiProperty({description:"name es el nombre del modulo"})
    @IsOptional()
    name?: string;

    @IsString({message:"description debe de ser un string (texto)"})
    @IsNotEmpty({message:"description no debe de estar vacio"})
    @ApiProperty({description:"description es el descripcion del modulo que esta disponible"})
    @IsOptional()
    description?: string;
}