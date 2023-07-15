import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { configCustomerDb } from "../../dominio/entities/config_custom.entity";

@Entity({ name: "config_customers" })
export class CustomersConfigModel implements configCustomerDb {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({ type: "int" })
  customer_id: number;
  
  @Column({ type: "varchar", length: 100 ,nullable:true})
  primary_color: string;
  
  @Column({ type: "varchar", length: 100,nullable:true })
  secondary_color: string;
  
  @Column({ type: "varchar", length: 100 ,nullable:true})
  tertiary_color: string;
  
  @Column({ type: "bytea" ,default:"N.A",nullable:true})
  icon_menu: Buffer;
  
  @Column({type:"boolean",nullable:true})
  dark_mode: boolean;

  @Column({ type: "varchar", length: 100 ,nullable:true})
  font_family: string;

  
  @CreateDateColumn()
  createdAt: Date;
  
  @UpdateDateColumn()
  updatedAt: Date;
  
  @Column({ type: "int" ,default:1})
  status: number;

}
