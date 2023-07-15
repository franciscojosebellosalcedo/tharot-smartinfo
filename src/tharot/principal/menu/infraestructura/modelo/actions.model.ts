import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { actionsEntity } from "../../dominio/entities/actions.entity";

@Entity({ name: "actions" })
export class ActionsModel implements actionsEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ type: "varchar" })
    name: string;

    @Column({ type: "int", default: 0 })
    id_form?: number;

    @Column({ type: "varchar" })
    description: string;

    @CreateDateColumn()
    createAt: Date;

    @UpdateDateColumn()
    updateAt: Date;

    @Column({ type: "int", default: 1 })
    status?: number;

}