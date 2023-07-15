import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsNumber, IsString, IsArray } from 'class-validator';
import { createForm as FormEntity } from "../../dominio/entities/form.entity";
import { CreateCampoDto } from "./campo.dto";

export class CreateFormDto implements FormEntity {
  @ApiProperty({
    description: "Id del propietario del formulario",
    example: "1",
  })
  @IsNumber()
  customer_id: number;

  @ApiProperty({
    description: "Titulo del formulario",
    example: "Registrar Clientes",
  })
  @IsString()
  titulo: string;

  @ApiProperty({
    description: "Ingresar el nombre de la tabla en donde se almacenaran los datos",
    example: "db_clientes",
  })
  @IsString()
  table_db: string;

  @ApiProperty({
    description: "Autorizacion para eliminar registro de la tabla",
    example: "1",
  })
  @IsNumber()
  delete_reg: number;

  @ApiProperty({
    description: "Un array con los datos de los campos del formulario",
    example: [ {
        "label": "Nombre",
        "name_bd": "name",
        "type": "Input",
        "format": "string",
        "required": 1,
        "order": 3,
        "unique": 1,
        "max_length": 250,
        "width": 50,
        "Options": "opcion 1&opcion 2&opcion 3"
    }],
  })
  @IsArray()
  campos: CreateCampoDto[]

}

export class UpdateFormDto extends PartialType(CreateFormDto) {}