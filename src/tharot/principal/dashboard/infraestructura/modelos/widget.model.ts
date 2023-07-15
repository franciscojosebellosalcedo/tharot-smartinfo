import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import {widgetEntity } from "../../dominio/entities/dashboard.entity";

@Entity({name:"widget"})
export class WidgetModel implements widgetEntity{
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({type:"int",nullable:true})
    column_id: number;

    @Column({type:"varchar"})
    title: string;

    @Column({type:"varchar"})
    content: string;

    @Column({type:"varchar"})
    data: string;

    @Column({type:"int",default:1})
    status?: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    update_at: Date;
}