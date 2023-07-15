import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { columnEntity } from "../../dominio/entities/dashboard.entity";

@Entity({name:"column"})
export class ColumnModel implements columnEntity{
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({type:"int"})
    dashboard_id: number;

    @Column({type:"varchar"})
    title: string;

    @Column({type:"int",default:1})
    status?: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    update_at: Date;
}