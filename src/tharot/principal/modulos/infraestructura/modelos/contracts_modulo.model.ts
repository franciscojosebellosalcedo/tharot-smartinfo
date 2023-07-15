import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { contractsModuloEntity } from "../../dominio/entities/contracts_modulo.entity";

@Entity({name:"contracts_modulo"})
export class ContractsModuloModel implements contractsModuloEntity{
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({type:"int"})
    id_customer: number;

    @Column({type:"int"})
    id_modulo: number;

    @CreateDateColumn()
    date_contract: Date;

    @Column({type:"date"})
    date_expiration: Date;

    @Column({type:"varchar",nullable:true})
    validity?: string;

    @Column({type:"numeric"})
    price: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @Column({type:"int",default:1})
    status?: number;
}

