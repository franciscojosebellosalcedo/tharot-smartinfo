import { user, auth } from "../../dominio/entities/user.entity";

import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "auth" })
export class Auth implements auth {
  
  @PrimaryGeneratedColumn()
  uid: number;
  
  @Column({ type: "varchar" })
  user_identity: string;
  
  @Column({ type: "varchar", length: 255, default: "N.A" })
  email: string;
  
  @Column({ type: "varchar", length: 255, default: "N.A" })
  password: string;

  @CreateDateColumn()
  change_password_date: Date;

  @Column({type:"int",default:0})
  authenticator_status:number;

  @Column({type:"varchar",default:"N.A"})
  authenticator_ascii:string;

  @Column({type:"varchar",default:"N.A"})
  otpauth_url_authenticator:string;

  @Column({type:"varchar",default: "N.A"})
  change_password_last: string;

  @Column({ type: "int", default: 1 })
  status: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
