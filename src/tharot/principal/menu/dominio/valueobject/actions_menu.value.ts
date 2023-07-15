import { actionsMenuEntity } from "../entities/actions_menu.entity";
import {v4 as uuid} from "uuid";

export class ActionsMenuData implements actionsMenuEntity {
    id?: number;
    id_action: number;
    id_submenu: number;
    status?: number;

    constructor({
        id_action,
        id_submenu
    }: {
        id?: number;
        id_action: number;
        id_submenu: number;
        status?: number;
    }) {
        this.id=uuid();
        this.id_action=id_action;
        this.id_submenu=id_submenu;
    }

}