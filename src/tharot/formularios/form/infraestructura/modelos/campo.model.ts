import { createCampo } from "../../dominio/entities/campo.entity";

import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "campos" })
export class campo implements createCampo {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({ type: "int" })
  form_id: number;

  @Column({ type: "varchar", length: 50 })
  label: string;

  @Column({ type: "varchar", length: 125 })
  name_bd: string;

  @Column({ type: "varchar", length: 50 })
  type: string;

  @Column({ type: "varchar", length: 50 })
  format: string;

  @Column({ type: "int", default: 1 })
  required: number;

  @Column({ type: "int" })
  order: number;

  @Column({ type: "int", default: 0 })
  unique: number;

  @Column({ type: "int" })
  max_length: number;

  @Column({ type: "float", default: 100 })
  width: string;

  @Column({ type: "varchar", default: "N.A" })
  options: string;

  @Column({ type: "int", default: 1 })
  status: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
