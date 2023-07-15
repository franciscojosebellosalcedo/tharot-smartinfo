import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { rol as RolEntity } from "../../dominio/entities/rol.entity";

export class CreateRolDto implements RolEntity {
  @ApiProperty({
    description: "Ingresar el nombre del rol",
    example: "Operador",
  })
  @IsString()
  @IsNotEmpty({message:"name no debe de estar vacion"})
  name: string;

  @ApiProperty({
    description: "Ingresar el nivel de acceso del rol",
    example: "2",
  })
  @IsNumber()
  @IsNotEmpty({message:"level no debe de estar vacion"})
  level: number;
}

export class UpdateRolDto {
  @IsNotEmpty({message:"Name del rol no debe de estar vacion"})
  @ApiProperty({description:"name (nombre del rol)",required:true,example:"administrador"})
  @IsOptional()
  @IsString({message:"name (nombre del rol) debe de ser un string "})
  name?: string;

  @IsInt({message:"Level debe ser un numero"})
  @IsNotEmpty({message:"level no debe de estar vacio"})
  @IsOptional()
  @ApiProperty({description:"level del rol del usuario",required:true,example:1})
  level?: number;
}
// export class UpdateRolDto extends PartialType(CreateRolDto) {}
