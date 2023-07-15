import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { moduloEntity } from "../../dominio/entities/modulo.entity";

@Entity({name:"modulo"})
export class ModuloModel implements moduloEntity{
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({type:"varchar"})
    name: string;

    @Column({type:"text"})
    description: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @Column({type:"int",default:1})
    status?: number;
    
}