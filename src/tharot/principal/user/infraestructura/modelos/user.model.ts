import { user } from "../../dominio/entities/user.entity";

import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";


@Entity({ name: "user" })
export class User implements user {
  
  @PrimaryGeneratedColumn()
  uid: number;
  
  @Column({ type: "varchar", unique: true,default:"N.A"})
  identity: string;
  
  @Column({ type: "int" })
  customer_id: number;
  
  @Column({ type: "int" })
  rol_id: number;
  
  @Column({ type: "varchar", length: 255 })
  username: string;

  @Column({ type: "varchar", length: 255 })
  lastname: string;
  
  @Column({type:"int"})
  session_active: number;

  @Column({ type: "int", default: 1 })
  status: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: "int", default: 0 })
  change_password: number;

  @Column({ type: "varchar" })
  address: string;

  @Column({type:"varchar"})
  phone: string;

}
