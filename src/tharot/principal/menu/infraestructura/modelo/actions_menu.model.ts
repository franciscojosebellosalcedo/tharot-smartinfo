import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { actionsMenuEntity } from "../../dominio/entities/actions_menu.entity";
@Entity({name:"actions_menu"})
export class ActionsMenuModel implements actionsMenuEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({type:"int"})
    id_action: number;

    @Column({type:"int"})
    id_submenu: number;

    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;

    @Column({type:"int",default:1})
    status?: number;

}