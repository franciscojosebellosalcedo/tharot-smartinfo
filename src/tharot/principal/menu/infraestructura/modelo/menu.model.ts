//decoradores de typeorm para crear la entidad customer
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { menu } from "../../dominio/entities/menu.entity";
import { SubMenuModel } from "./sub_menu.model";

//modelo de la entidad customer para la base de datos
@Entity({name:"menu"})
export class MenuModel implements menu{
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({type:"int", default: 1})
    modulo_id?: number;

    @Column({type:"varchar",length:100})
    name: string;

    @Column({type:"int"})
    ubicacion: number;

    @Column({type:"int", default: 1})
    status?: number;

    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
}