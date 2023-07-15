import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsObject, IsArray, IsNumber } from 'class-validator';
import { menuData as MenuEntity } from "../../dominio/valueobject/menu.value";
import { CreateSubMenuDto } from './sub_menus.dto';

export class CreateMenuDto implements MenuEntity {
  @ApiProperty({
    description: "Ingresar el nombre del menu",
    example: "Usuarios",
  })
  @IsString({message:"El name del menu debe de ser un string"})
  @IsNotEmpty({message:"El name no debe de estar vacio"})
  name: string;

  @ApiProperty({
    description: "Ingresar la ubicacion del menu",
    example: 1,
  })
  @IsString({message:"la ubicacion del menu debe de ser un string"})
  @IsNotEmpty({message:"la ubicacion no debe de estar vacio"})
  ubicacion: number;
}

export class menuComplete {
    @ApiProperty({
      description: "Datos del menu padre",
      example: {
        "name":"Usuarios",
        "ubicacion": "Slice"
      },
    })
    @IsObject()
    menu: CreateMenuDto;

    @ApiProperty({
      description: "Datos de los submenus",
      example: [{
        "name":"Lista de Usuarios",
        "orden": 1,
        "acciones": "Consultar",
        "roles":[1,2,3]
      }],
    })
    @IsArray()
    sub_menu: CreateSubMenuDto[];
}

export class UpdateMenuDto extends PartialType(CreateMenuDto) {}
