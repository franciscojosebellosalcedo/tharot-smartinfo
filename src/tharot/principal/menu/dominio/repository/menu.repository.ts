import { UpdateMenuData, menuData, menuDataComplete } from "../valueobject/menu.value";
//interface del repositorio de customer, este contiene todos los metodos que seran llamados
export interface InterfaceMenuRepository{
    getAllMenuAccordingStatus(status: number):Promise<menuData[] | null>;
    getAllMenusDb():Promise<menuData[] | null>;

    getMenuByName(name:string):Promise<menuData>;
    createMenu(newMenu:menuData):Promise<menuData | any>;
    deleteMenu(menuId:number):Promise<any | null>;
    getAllMenu(rol_id:number):Promise<menuDataComplete[] | null>;
    getMenuById(menuId:number):Promise<menuData | null>;
    updateMenu(menuId:number,newData:UpdateMenuData):Promise<menuData | any>;
    enableMenu(menuId:number):Promise<menuData | any>;
}