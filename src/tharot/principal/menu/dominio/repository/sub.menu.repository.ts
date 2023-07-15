import { UpdateSubMenuData, subMenuData } from "../valueobject/sub.menu.value";
//interface del repositorio de customer, este contiene todos los metodos que seran llamados
export interface InterfaceSubMenuRepository{
    deleteSubMenuById(idSubMenu:number):Promise<any>;
    getSubMenuByIdForm(idForm:number):Promise<subMenuData | null>;
    createSubMenu(newMenu:subMenuData):Promise<subMenuData | any>;
    deleteSubMenu(menuId:number):Promise<any>;
    getSubMenuById(sub_menuId:number):Promise<subMenuData | null>;
    updateSubMenu(sub_menuId:number,newData:UpdateSubMenuData):Promise<subMenuData | any>;
    enableSubMenu(sub_menuId:number):Promise<subMenuData | any>;
}