import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { actionsMenuRepository } from "../../dominio/repository/actions_menu.repository";
import { ActionsMenuData } from "../../dominio/valueobject/actions_menu.value";
import { ActionsMenuModel } from "../modelo/actions_menu.model";

@Injectable()
export class ActionsMenuService implements actionsMenuRepository{
    constructor(@InjectRepository(ActionsMenuModel) private readonly _actions_menu: Repository<ActionsMenuModel>) {
    }

    async getAllActionMenuByIdAction(idAction: number): Promise<ActionsMenuData[]> {
        return await this._actions_menu.find({where:{id_action: idAction}});
    }

    async getAllActionMenuByIdSubMenu(idSubMenu: number): Promise<ActionsMenuData[]> {
        return await this._actions_menu.find({where:{id_submenu: idSubMenu}});
    }

    async getAllActionMenu(): Promise<ActionsMenuData[]> {
        return await this._actions_menu.find();
    }

    async getOneActionMenuById(idActionMenu: number): Promise<ActionsMenuData> {
        return await this._actions_menu.findOne({where:{id:idActionMenu}});
    }

    async enableActionMenuById(idActionMenu: number): Promise<ActionsMenuData> {
        await this._actions_menu.update({id:idActionMenu},{status:1});
        return await this._actions_menu.findOne({where:{id: idActionMenu}});
    }

    async disableActionMenuById(idActionMenu: number): Promise<ActionsMenuData | null> {
        await this._actions_menu.update({id:idActionMenu},{status:0});
        return await this._actions_menu.findOne({where:{id: idActionMenu}});
    }
    
    async createActionMenu(body: ActionsMenuData): Promise<ActionsMenuData> {
        const actionMenuCreated= this._actions_menu.create(body);
        return await this._actions_menu.save(actionMenuCreated);
    }

    
}