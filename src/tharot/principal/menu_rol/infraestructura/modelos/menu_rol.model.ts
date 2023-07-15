//decoradores de typeorm para crear la entidad customer
import { SubMenuModel } from "../../../menu/infraestructura/modelo/sub_menu.model";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { menu_rol } from "../../dominio/entities/menu_rol.entity";

//modelo de la entidad customer para la base de datos
@Entity({name:"menu_rol"})
export class MenuRolModel implements menu_rol{
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({type:"int"})
    id_rol: number;

    @Column({type:"int"})
    sub_menu_id: number;

    @Column({type:"int",default:1})
    status?: number;
}