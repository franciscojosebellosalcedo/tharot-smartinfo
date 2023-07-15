import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { InterfaceSessionModel } from "../../dominio/entities/session.entity";


@Entity({name:"session"})
export class Session implements InterfaceSessionModel{
    
    @PrimaryGeneratedColumn({type:"int"})
    id: number;

    @Column({type: "varchar"})
    ip_device: string;

    @Column({type:"varchar"})
    name_device: string;

    @Column({type:"varchar"})
    name_country: string;

    @Column({type:"varchar"})
    city: string;

    @Column({type:"varchar"})
    region: string;
    
    @Column({type:"varchar"})
    user_id: string;
    
    @Column({type:"varchar"})
    token: string;
    
    @CreateDateColumn({type:"date"})
    date_login: Date;
    
    @Column({type:"date",default:null})
    date_logout: Date;
    
    @Column({type:"int",default:1})
    status: number;
}