//decoradores de typeorm para crear la entidad customer
import { MenuRolModel } from "../../../menu_rol/infraestructura/modelos/menu_rol.model";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { sub_menu } from "../../dominio/entities/sub.menu.entity";
import { MenuModel } from "./menu.model";

//modelo de la entidad customer para la base de datos
@Entity({name:"sub_menu"})
export class SubMenuModel implements sub_menu{
    @PrimaryGeneratedColumn()
    id?: number;
    
    @Column({type:"int"})
    menu_id: number;

    @Column({type:"int",default:0})
    type_form: number;

    @Column({type:"int",default:0})
    id_form: number;

    @Column({type:"varchar",length:100})
    name: string;

    @Column({type:"varchar",length:100,default:"Sub Menu"})
    descripcion: string;

    @Column({type:"int"})
    orden: number;

    @Column({type:"varchar",length:100})
    acciones: string;

    @Column({type:"int",default:1})
    status?: number;

    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
}