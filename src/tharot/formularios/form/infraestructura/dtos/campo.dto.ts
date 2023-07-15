import { ApiProperty } from "@nestjs/swagger";
import {  IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { createCampo as CampoEntity } from "../../dominio/entities/campo.entity";

export class CreateCampoDto implements CampoEntity {
  @ApiProperty({
    description: "Titulo del campo",
    example: "Nombre",
  })
  @IsString()
  @IsNotEmpty({ message: "label no debe de estar vacio" })
  label: string;

  @ApiProperty({
    description: "Nombre del campo en la base de datos",
    example: "name",
  })
  @IsString()
  @IsNotEmpty({ message: "name_bd no debe de estar vacio" })
  name_bd: string;

  @ApiProperty({
    description: "Tipo de campo",
    example: "Input",
  })
  @IsString()
  @IsNotEmpty({ message: "type no debe de estar vacio" })
  type: string;

  @ApiProperty({
    description: "Formato de almacenamiento del campo",
    example: "string",
  })
  @IsString()
  @IsNotEmpty({ message: "format no debe de estar vacio" })
  format: string;

  @ApiProperty({
    description: "Definición de sí el campo es requerido o no",
    example: "1",
  })
  @IsNumber()
  @IsNotEmpty({ message: "required no debe de estar vacio" })
  required: number;

  @ApiProperty({
    description: "Orden en el que se va a mostrar el campo",
    example: "1",
  })
  @IsNumber()
  @IsNotEmpty({ message: "order no debe de estar vacio" })
  order: number;

  @ApiProperty({
    description:
      "Definición de sí el valor del campo es único en la base de datos",
    example: "1",
  })
  @IsNumber()
  @IsNotEmpty({ message: "unique no debe de estar vacio" })
  unique: number;

  @ApiProperty({
    description: "Número máximo de caracteres",
    example: "1",
  })
  @IsNumber()
  @IsNotEmpty({ message: "max_length no debe de estar vacio" })
  max_length: number;

  @ApiProperty({
    description: "Tamaño del campo en el formulario",
    example: "50",
  })
  @IsString()
  @IsNotEmpty({ message: "width no debe de estar vacio" })
  width: string;

  @ApiProperty({
    description: "opciones de seleccion",
    example: "opcion 1&opcion 2&opcion 3",
  })
  @IsString()
  @IsNotEmpty({ message: "Las opciones no debe de estar vacio" })
  @IsOptional()
  options?: string;
}

export class UpdateCampoDto {
  @IsString({message:"label debe de ser un string "})
  @IsNotEmpty({message:"label no debe de estar vacio"})
  @ApiProperty({description:"label (nombre) de campo de un formulario"})
  @IsOptional()
  label?: string;

  @IsString({message:"name_bd debe de ser un string "})
  @IsNotEmpty({message:"name_bd no debe de estar vacio"})
  @ApiProperty({description:"name_bd (nombre de la base de datos)"})
  @IsOptional()
  name_bd?: string;

  @IsString({message:"type debe de ser un string "})
  @IsNotEmpty({message:"type no debe de estar vacio"})
  @ApiProperty({description:"type (tipo de campo del formulario)"})
  @IsOptional()
  type?: string;

  @IsString({message:"format debe de ser un string "})
  @IsNotEmpty({message:"format no debe de estar vacio"})
  @ApiProperty({description:"format (formato de campo del formulario)"})
  @IsOptional()
  format?: string;

  @IsNumber()
  @IsNotEmpty({message:"required no debe de estar vacio"})
  @ApiProperty({description:"required (que si es requido u opcional)"})
  @IsOptional()
  required?: number;

  @IsNumber()
  @IsNotEmpty({message:"order no debe de estar vacio"})
  @ApiProperty({description:"order (orden del campo del formulario)"})
  @IsOptional()
  order?: number;

  @IsNumber()
  @IsNotEmpty({message:"order no debe de estar vacio"})
  @ApiProperty({description:"order (orden del campo del formulario)"})
  @IsOptional()
  unique?: number;

  @IsNumber()
  @IsNotEmpty({message:"max_length no debe de estar vacio"})
  @ApiProperty({description:"max_length (maximo de tamaño del campo del formulario)"})
  @IsOptional()
  max_length?: number;

  @IsString({message:"width debe de ser un string "})
  @IsNotEmpty({message:"width no debe de estar vacio"})
  @ApiProperty({description:"width (ancho de tamaño del campo del formulario)"})
  @IsOptional()
  width?: string;

  @IsNumber()
  @IsNotEmpty({message:"status no debe de estar vacio"})
  @ApiProperty({description:"status (estado del campo del formulario)"})
  @IsOptional()
  status?: number
}

// export class UpdateCampoDto extends PartialType(CreateCampoDto) {}
