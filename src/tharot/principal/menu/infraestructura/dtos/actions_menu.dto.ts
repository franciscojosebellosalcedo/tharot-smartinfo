import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";
import { actionsEntity } from "../../dominio/entities/actions.entity";
import { actionsMenuEntity } from "../../dominio/entities/actions_menu.entity";

export class CreatedActionsSubMenu implements actionsMenuEntity{
    @IsNumber()
    @IsNotEmpty({message:"id_action no debe de estar vacio"})
    @ApiProperty({description:"id_action es el id de la accion"})
    id_action: number;

    @IsNumber()
    @IsNotEmpty({message:"id_submenu no debe de estar vacio"})
    @ApiProperty({description:"id_submenu es el id del submenu"})
    id_submenu: number;
}