import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { actionsEntity } from "../../dominio/entities/actions.entity";

export class UpdateActionDto{
    @IsString({message:"name nuevo debe de ser un string"})
    @IsNotEmpty({message:"name nuevo no debe de estar vacio"})
    @ApiProperty({description:"name es el nombre nuevo de la accion"})
    @IsOptional()
    name?: string;

    @IsString({message:"description nueva debe de ser un string"})
    @IsNotEmpty({message:"description nueva no debe de estar vacio"})
    @ApiProperty({description:"description es la descripcion nueva de la accion"})
    @IsOptional()
    description?: string;
}

export class CreateActionsDto implements actionsEntity{
    @IsString({message:"name debe de ser un string"})
    @IsNotEmpty({message:"name no debe de estar vacio"})
    @ApiProperty({description:"name es el nombre de la accion"})
    name: string;

    @IsNotEmpty()
    @IsOptional()
    id_form?: number;

    @IsString({message:"description debe de ser un string"})
    @IsNotEmpty({message:"description no debe de estar vacio"})
    @ApiProperty({description:"description es la descripcion de la accion"})
    description: string;
}