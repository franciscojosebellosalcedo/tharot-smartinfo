import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from 'class-validator';
import { menuRolData as MenuEntity } from "../../dominio/valueobject/menu_rol.value";

export class CreateMenuRolDto implements MenuEntity {
  @ApiProperty({
    description: "Ingresar id del rol al que se le asignara el permiso",
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty({message:"El id del rol no debe de estar vacio"})
  id_rol: number;

  @ApiProperty({
    description: "Ingresar id del sub menu al que se le asignara el permiso",
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty({message:"El id del rol no debe de estar vacio"})
  sub_menu_id: number;
}


export class UpdateMenuRolDto extends PartialType(CreateMenuRolDto) {}
