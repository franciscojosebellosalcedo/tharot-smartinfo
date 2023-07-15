//decoradores de typeorm para crear la entidad customer
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ConfigMailer } from "../../dominio/entities/mail.entity";

//modelo de la entidad customer para la base de datos
@Entity({name:"config_mailer"})
export class ConfigMailerModel implements ConfigMailer{
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({type:"varchar",length:100,unique:true})
    host: string;

    @Column({type:"int"})
    port: number;

    @Column({type:"int"})
    secure: number;

    @Column({type:"varchar",length:100,unique:true})
    secret: string; 
    
    @Column({type:"varchar",unique:true})
    email: string;

    @Column({type:"int",default:1})
    status: number;
}