import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InterfaceMenuRepository } from '../../dominio/repository/menu.repository';
import { menuData, menuDataComplete, UpdateMenuData } from '../../dominio/valueobject/menu.value';
import { MenuModel } from '../modelo/menu.model';
import { SubMenuModel } from '../modelo/sub_menu.model';
import { MenuRolService } from '../../../menu_rol/infraestructura/servicios/menu_rol.service';
import { MenuRolCaso } from '../../../menu_rol/aplicasion/menu_rol.casouso';
@Injectable()
export class MenuService implements InterfaceMenuRepository{
    private readonly menu_rol_caso:MenuRolCaso
    constructor(private readonly menu_rol:MenuRolService, @InjectRepository(MenuModel) private readonly _Menu: Repository<MenuModel>, @InjectRepository(SubMenuModel) private readonly _SubMenu: Repository<SubMenuModel>) {
        this.menu_rol_caso = new MenuRolCaso(menu_rol)
    }

    async getAllMenusDb(): Promise<menuData[]> {
        return await this._Menu.find();
    }

    async getAllMenuAccordingStatus(status: number): Promise<menuData[]> {
        return await this._Menu.find({where:{status:status}});
    }

    async getMenuByName(name: string): Promise<menuData> {
        return await this._Menu.findOne({where:{name: name}});
    }

    async createMenu(newMenu: menuData): Promise<any> {
        const menu = this._Menu.create(newMenu);
        return this._Menu.save(menu);
    }
    
    async deleteMenu(menuId: number): Promise<any> {
        const deleteSub = await this._SubMenu.delete({menu_id:menuId});
        if (deleteSub) {
            var menu = await this._Menu.delete({id:menuId});
        }
        return menu;
    }

    async getAllMenu(rol_id:number): Promise<menuDataComplete[]> {
        const menus = await this._Menu.find({where:{status:1}});
        const datos:menuDataComplete[] = await Promise.all(menus.map(async item=>{
            const sub_menus = await this._SubMenu.find({where:{menu_id:item.id}})
            const subs = await Promise.all(sub_menus.map(async sub=>{
                const validate = await this.menu_rol_caso.validateSubMenuByRol(sub.id, rol_id)
                if(validate){
                    return sub;
                }
            }))
            const sub = subs.filter(item=>item!=null);
            if(sub.length > 0){ 
                const data: menuDataComplete = {...item, submenus: sub};
                return data;
            }            
        }))      
        return datos.filter(item=>item != null);
    }

    async getMenuById(menuId: number): Promise<menuData> {
        return await this._Menu.findOne({where:{id:menuId}});
    }

    async updateMenu(menuId: number, newData: UpdateMenuData): Promise<any> {
        const menu = await this._Menu.findOne({where:{id:menuId}});
        const data = {...menu, ...newData};
        return await this._Menu.save(data);
    }

    async enableMenu(menuId: number): Promise<any> {
        const menu = await this._Menu.findOne({where:{id:menuId}});
        menu.status = 0;
        return await this._Menu.save(menu);
    }

}
