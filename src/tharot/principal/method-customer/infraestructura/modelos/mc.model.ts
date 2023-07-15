import { mc } from "../../dominio/entities/mc.entity";
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "method-customer" })
export class Mc implements mc {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int", nullable: false })
  method_id: number;

  @Column({ type: "int", nullable: false })
  customer_id: number;

  @Column({ type: "int", default: 1 })
  status: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
