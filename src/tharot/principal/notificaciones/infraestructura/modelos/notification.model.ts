import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { notificationEntity } from "../../dominio/entities/notification.entity";

@Entity({name:"notifications"})
export class NotificationModel implements notificationEntity{
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({type:"int"})
    user_id: number;

    @Column({type:"varchar"})
    title: string;

    @Column({type:"varchar"})
    description: string;

    @Column({type:"varchar"})
    type_notification: string;

    @CreateDateColumn()
    dateCreated: Date;

    @Column({type:"int",default:1})
    status: number;
    
}