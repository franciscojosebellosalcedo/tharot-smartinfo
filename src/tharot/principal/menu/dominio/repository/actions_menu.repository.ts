import { ActionsMenuData } from "../valueobject/actions_menu.value";

export interface actionsMenuRepository {
    getAllActionMenuByIdAction(idAction:number):Promise<ActionsMenuData[] | null>;
    getAllActionMenuByIdSubMenu(idSubMenu:number):Promise<ActionsMenuData[] | null>;
    getAllActionMenu():Promise<ActionsMenuData[] | null>;
    getOneActionMenuById(idActionMenu:number):Promise<ActionsMenuData| null>;
    enableActionMenuById(idActionMenu:number):Promise<ActionsMenuData | null>
    disableActionMenuById(idActionMenu:number):Promise<ActionsMenuData | null>;
    createActionMenu(body:ActionsMenuData):Promise<ActionsMenuData | null>;
}