import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { verifyCode } from "../../dominio/entities/user.entity";

@Entity({name:"verify_code"})
export class VerifyCode implements verifyCode{
    @PrimaryGeneratedColumn()
    id?: number;
    
    @Column({type:"varchar"})
    code: string;
    
    @Column({type:"varchar"})
    email_auth: string;
    
    @Column()
    expired_date: Date;

    @Column({type:"int"})
    status: number;
    
}