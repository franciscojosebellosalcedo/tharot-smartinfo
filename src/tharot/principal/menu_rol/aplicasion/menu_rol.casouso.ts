import { InterfaceMenuRolRepository } from "../dominio/repository/menu_rol.repository";
import { menuRolData } from "../dominio/valueobject/menu_rol.value";

export class MenuRolCaso {
  constructor(private readonly menu_rol: InterfaceMenuRolRepository) { }

  async deleteAllMenuRolByIdSubMenu(idSubMenu: number) {
    const responseDeleted = await this.menu_rol.deleteAllMenuRolByIdSubMenu(idSubMenu);
    if(responseDeleted["affected"]===0){
      return {ok:false,status:404,message:"Menu rol no existente"};
    }
    return {ok:true,status:200,message:"Eliminado con exito"};
  }

  async createPermiso(data: menuRolData) {
    try {
      return await this.menu_rol.createMenuRol(data);
    } catch (error) {
      return error;
    }
  }

  async inhabilitarPermiso(menu_id: number) {
    try {
      return await this.menu_rol.enableMenuRol(menu_id);
    } catch (error) {
      return error;
    }
  }

  async eliminarPermiso(menu_id: number) {
    try {
      return await this.menu_rol.deleteMenuRol(menu_id);
    } catch (error) {
      return error;
    }
  }

  async getAllMenusByRol(rol_id: number): Promise<menuRolData[] | null> {
    try {
      return await this.menu_rol.getAllMenuRol(rol_id);
    } catch (error) {
      return error;
    }
  }

  async validateSubMenuByRol(id_menu: number, rol_id: number) {
    try {
      const find = await this.menu_rol.getMenuByRolAndMenu(id_menu, rol_id)
      if (find) {
        return true;
      }
      return false;
    } catch (error) {
      return error;
    }
  }

  async addPermission(id_menu: number, rol_id: number) {
    try {
      return await this.menu_rol.createMenuRol({ id_rol: rol_id, sub_menu_id: id_menu })
    } catch (error) {
      return error;
    }
  }
}
