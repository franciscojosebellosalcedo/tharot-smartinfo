import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InterfaceSubMenuRepository } from '../../dominio/repository/sub.menu.repository';
import { subMenuData, UpdateSubMenuData } from '../../dominio/valueobject/sub.menu.value';
import { SubMenuModel } from '../modelo/sub_menu.model';
@Injectable()
export class SubMenuService implements InterfaceSubMenuRepository{
    constructor(@InjectRepository(SubMenuModel) private readonly _SubMenu: Repository<SubMenuModel>) {
    }

    async deleteSubMenuById(idSubMenu: number): Promise<any> {
        return await this._SubMenu.delete({id: idSubMenu});
    }

    async getSubMenuByIdForm(idForm: number): Promise<subMenuData> {
        return await this._SubMenu.findOne({where:{id_form: idForm}});
    }
    
    async createSubMenu(newSubMenu: subMenuData): Promise<any> {
        try {
            const res = await this._SubMenu.create(newSubMenu);            
            return await this._SubMenu.save(res);
        } catch (error) {
            console.log(error);   
        }        
    }

    async deleteSubMenu(menuId: number): Promise<any> {
        return await this._SubMenu.delete(menuId);
    }

    async getSubMenuById(sub_menuId: number): Promise<subMenuData> {
        return await this._SubMenu.findOne({where:{id:sub_menuId}});
    }

    async updateSubMenu(sub_menuId: number, newData: UpdateSubMenuData): Promise<any> {
        const data = await this._SubMenu.findOne({where:{id: sub_menuId}});
        const updated = {...data, ...newData};
        return await this._SubMenu.save(updated);
    }
    
    async enableSubMenu(sub_menuId: number): Promise<any> {
        const data = await this._SubMenu.findOne({where:{id: sub_menuId}});
        data.status = 0;
        return await this._SubMenu.save(data);
    }
}
