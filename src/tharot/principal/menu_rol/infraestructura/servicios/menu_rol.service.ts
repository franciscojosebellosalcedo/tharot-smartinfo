import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MenuRolModel } from '../modelos/menu_rol.model';
import { InterfaceMenuRolRepository } from '../../dominio/repository/menu_rol.repository';
import { menuRolData, UpdateMenuRolData } from '../../dominio/valueobject/menu_rol.value';

@Injectable()
export class MenuRolService implements InterfaceMenuRolRepository{
    constructor(@InjectRepository(MenuRolModel) private _MenuRol: Repository<MenuRolModel>) {
    }

    async deleteAllMenuRolByIdSubMenu(idSubMenu: number): Promise<any> {
        return await this._MenuRol.delete({sub_menu_id:idSubMenu});
    }

    async createMenuRol(newMenu: menuRolData): Promise<any> {
        const data = await this._MenuRol.create(newMenu);
        return await this._MenuRol.save(data);
    }

    async deleteMenuRol(menuId: number): Promise<any> {
        return await this._MenuRol.delete(menuId);
    }

    async getAllMenuRol(idRol:number): Promise<menuRolData[]> {
        return await this._MenuRol.find({where:{id_rol:idRol}});
    }

    async enableMenuRol(menuId: number): Promise<any> {
        const data = await this._MenuRol.findOne({where:{id : menuId}});
        data.status = 0;
        return await this._MenuRol.save(data);
    }   

    async getMenuByRolAndMenu(menuId: number, idRol: number): Promise<any> {
        const datos = await this._MenuRol.findOne({where:{id_rol:idRol, sub_menu_id:menuId}});      
        return datos;
    }
 
}
