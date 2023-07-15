
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { dashboardEntity } from "../../dominio/entities/dashboard.entity";

@Entity({ name: "dashboard" })
export class DashboardModel implements dashboardEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({type:"int"})
    user_id: number;

    @Column({type:"varchar"})
    distribution: string;

    @Column({type:"int"})
    amount_column: number;

    @Column({type:"int",default:1})
    status?: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
  
}
