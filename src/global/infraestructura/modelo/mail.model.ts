import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { CreateDataMail } from "../../dominio/entities/mail.entity";

@Entity({ name: "email" })
export class MailModel implements CreateDataMail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 100, unique: true })
  titulo: string;

  @Column({ type: "varchar", length: 100, unique: true })
  asunto: string;

  @Column({ type: "varchar", unique: true })
  body: string;

  @Column({ type: "int", default: 1 })
  status: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
