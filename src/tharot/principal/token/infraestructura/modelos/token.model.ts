import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { InterfaceTokenEntity } from "../../dominio/entities/token.entity";


@Entity({name:"tokens"})
export class TokenModel implements InterfaceTokenEntity{
    @PrimaryGeneratedColumn({type:"int"})
    id?: number;

    @Column({type:"int"})
    method_id: number;

    @Column({type:"int"})
    user_id: number;

    @Column({type:"varchar"})
    token: string;

    @Column({type:"int"})
    status: number;

}