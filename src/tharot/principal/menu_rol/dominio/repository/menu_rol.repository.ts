import { UpdateMenuRolData, menuRolData } from "../valueobject/menu_rol.value";
//interface del repositorio de customer, este contiene todos los metodos que seran llamados
export interface InterfaceMenuRolRepository{
    deleteAllMenuRolByIdSubMenu(idSubMenu:number):Promise<any>;
    createMenuRol(newMenu:menuRolData):Promise<menuRolData | any>;
    deleteMenuRol(menuId:number):Promise<any>;
    getAllMenuRol(idRol:number):Promise<menuRolData[] | null>;
    enableMenuRol(menuId:number):Promise<menuRolData | any>;
    getMenuByRolAndMenu(menuId:number, idRol:number):Promise<menuRolData | any>;
}