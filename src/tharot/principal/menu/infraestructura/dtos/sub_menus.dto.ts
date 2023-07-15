import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { subMenuData as SubMenuEntity, moveSubMenu } from "../../dominio/valueobject/sub.menu.value";

export class CreateSubMenuDto implements SubMenuEntity {
  @IsOptional()
  type_form: number;
  
  @IsOptional()
  id_form: number;

  menu_id: number;
  
  @ApiProperty({
    description: "Ingresar el nombre del menu",
    example: "Usuarios",
  })
  @IsString({message:"El name del menu debe de ser un string"})
  @IsNotEmpty({message:"El name no debe de estar vacio"})
  name: string;

  @ApiProperty({
    description: "Ingresar el nombre del menu",
    example: "Usuarios",
  })
  @IsString({message:"El name del menu debe de ser un string"})
  @IsNotEmpty({message:"El name no debe de estar vacio"})
  acciones: string;

  @IsNumber()
  @IsNotEmpty({message:"El orden no debe de estar vacio"})
  orden: number;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsNotEmpty({message:"los roles asignado no debe ser vacio"})
  roles: number[];
}


export class MoveSubMenuDto implements moveSubMenu{

  @ApiProperty({
    description: "Ingresar el id del sub menu que desea mover",
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty({message:"El id del sub menu no debe de estar vacio"})
  id_sub: number;

  @ApiProperty({
    description: "Ingresar el id del menu destino del sub menu",
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty({message:"El id del menu no debe de estar vacio"})
  id_destination: number;
}

export class UpdateSubMenuDto extends PartialType(CreateSubMenuDto) {}
