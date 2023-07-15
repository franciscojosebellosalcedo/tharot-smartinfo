import { createForm } from "../../dominio/entities/form.entity";

import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "Form" })
export class Form implements createForm {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int", default: 1 })
  customer_id: number;

  @Column({ type: "varchar", length: 50 ,unique:true})
  table_db: string;

  @Column({ type: "int", default: 1 })
  delete_reg: number;

  @Column({ type: "varchar", length: 50 })
  titulo: string;

  @Column({ type: "int", default: 1 })
  status: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
