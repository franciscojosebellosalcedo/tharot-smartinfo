//decoradores de typeorm para crear la entidad customer
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { InterfaceEntityCustomers } from "../../dominio/entities/customers.entity";

//modelo de la entidad customer para la base de datos
@Entity({name:"customers"})
export class CustomersModel implements InterfaceEntityCustomers{
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({type:"bytea",unique:true,default:null})
    logo: Buffer;

    @Column({type:"varchar",length:100,unique:true})
    nit: string;
    
    @Column({type:"varchar",length:100})
    name: string;
    
    @Column({type:"varchar"})
    address: string;
    
    @Column({type:"varchar"})
    phone: string;
    
    @Column({type:"varchar",unique:true})
    email: string;

    @Column({type:"int",default:1})
    status: number;

}