import { actionsEntity } from "../entities/actions.entity";
import { v4 as uuid } from "uuid";

export class UpdateActionData {
    name?: string;
    description?: string;

    constructor({
        name,
        description
    }: {
        name?: string;
        id_form?: number;
        description?: string;
    }) {
        this.name = name;
        this.description = description;
    }
}

export class ActionsData implements actionsEntity {
    id?: number;
    name: string;
    id_form?: number;
    description: string;
    status?: number;

    constructor({
        name,
        id_form,
        description
    }: {
        id?: number;
        name: string;
        id_form?: number;
        description: string;
        status?: number;
    }) {
        this.id = uuid();
        this.name = name;
        this.id_form = id_form;
        this.description = description;
        this.status = 1;
    }
}