import { InterfaceMenuRepository } from "../dominio/repository/menu.repository";
import { InterfaceSubMenuRepository } from "../dominio/repository/sub.menu.repository";
import { menuData, menuDataComplete } from '../dominio/valueobject/menu.value';
import {
  subMenuData,
  moveSubMenu,
  UpdateSubMenuData
} from "../dominio/valueobject/sub.menu.value";
import { MenuRolCaso } from "../../menu_rol/aplicasion/menu_rol.casouso";
import { InterfaceMenuRolRepository } from "../../menu_rol/dominio/repository/menu_rol.repository";
import { ActionsData, UpdateActionData } from "../dominio/valueobject/actions.value";
import { actionsRepository } from "../dominio/repository/actions.repository";
import { actionsMenuRepository } from "../dominio/repository/actions_menu.repository";
import { ActionsMenuData } from "../dominio/valueobject/actions_menu.value";

export class MenuCaso {
  private readonly menu_rol: MenuRolCaso;
  constructor(
    private readonly menu: InterfaceMenuRepository,
    private readonly sub_menu: InterfaceSubMenuRepository,
    private readonly menu_rol_repo: InterfaceMenuRolRepository,
    private readonly actions_repository: actionsRepository,
    private readonly action_menu_repository: actionsMenuRepository
  ) {
    this.menu_rol = new MenuRolCaso(menu_rol_repo);
  }

  //ACTIONS MENU

  async getAllActionMenu() {
    const actionsMenus = await this.action_menu_repository.getAllActionMenu();
    if (actionsMenus.length === 0) {
      return { ok: false, status: 204, message: "No hay acciones submenu", error: { message: "No hay acciones de menu registradas en la aplicacion" } }
    }
    return { ok: true, status: 200, message: "Acciones de submenu enocntrada", datos: [...actionsMenus] };
  }

  async getOneActionMenuById(idActionMenu: number) {
    const actionMenuFound = await this.action_menu_repository.getOneActionMenuById(idActionMenu);
    if (!actionMenuFound) {
      return { ok: false, status: 404, message: "Acción de submenu no encontrada", error: { message: "Esta acción de sbmenu no existe en la aplicacion " } };
    }
    return { ok: true, status: 200, message: "Acción de submenu encontrada", datos: { ...actionMenuFound } };
  }

  async getAllActionMenuByIdSubMenu(idSubMenu: number) {
    const actionsMenus = await this.action_menu_repository.getAllActionMenuByIdSubMenu(idSubMenu);
    if (actionsMenus.length === 0) {
      return { ok: false, status: 204, message: "No hay acciones de menu registradas", datos: [...actionsMenus] };
    }
    return { ok: true, status: 200, message: "Acciones de menu encontradas", datos: [...actionsMenus] };
  }

  async getAllActionMenuByIdAction(idAction: number) {
    const actionsMenus = await this.action_menu_repository.getAllActionMenuByIdAction(idAction);
    if (actionsMenus.length === 0) {
      return { ok: false, status: 204, message: "No hay acciones de menu registradas", datos: [...actionsMenus] };
    }
    return { ok: true, status: 200, message: "Acciones de menu encontradas", datos: [...actionsMenus] };
  }

  async enableActionMenuById(idActionMenu: number) {
    const actionMenuEnable = await this.action_menu_repository.enableActionMenuById(idActionMenu);
    if (!actionMenuEnable) {
      return { ok: false, status: 404, message: "Acción del menu no encontrada", error: { message: "No existe la accion de menu" } };
    }
    if (actionMenuEnable.status < 1) {
      return { ok: false, status: 204, message: "No se pudo activar la accion de menu", error: { message: "no cambio el status del registro" } };
    }
    return { ok: true, status: 200, message: "Acción activada con exito ", datos: { ...actionMenuEnable } };
  }

  async disableActionMenuById(idActionMenu: number) {
    const actionMenuDisabled = await this.action_menu_repository.disableActionMenuById(idActionMenu);
    if (!actionMenuDisabled) {
      return { ok: false, status: 404, message: "Acción del menu no encontrada", error: { message: "No existe la accion de menu" } };
    }
    if (actionMenuDisabled.status > 0) {
      return { ok: false, status: 204, message: "No se pudo desactivar la accion de menu", error: { message: "no cambio el status del registro" } };
    }
    return { ok: true, status: 200, message: "Acción desactivada con exito ", datos: { ...actionMenuDisabled } };
  }

  async createActionMenu(body: ActionsMenuData) {
    const actionFound = await this.actions_repository.getOneActionByIdAction(body.id_action);
    if (!actionFound) {
      return { ok: false, message: "Acción no existente", status: 404, error: { message: "la acción no existe en la aplicación" } };
    }
    const actionMenuCreated = await this.action_menu_repository.createActionMenu(body);
    if (!actionMenuCreated) {
      return { ok: false, status: 204, message: "No se pudo crear la acción submenu", error: { message: "se produjo un error al crear una accion de submenu" } };
    }
    return { ok: true, status: 200, message: "Acción de submenu creada con exito", datos: { ...actionMenuCreated } };
  }


  //ACTIONS

  async enableAction(idAction: number) {
    const actionEnable = await this.actions_repository.enableAction(idAction);
    if (!actionEnable) {
      return { ok: false, message: "Acción no encontrada", status: 404, error: { message: "accion no existente en la aplicacion" } };
    }
    if (actionEnable.status < 1) {
      return { ok: false, status: 204, message: "No se pudo activar la acción", error: { message: "No cambio el status del registro" } };
    }
    return { ok: false, status: 200, message: "Acción activada con exito", datos: { ...actionEnable } };
  }

  async disableAction(idAction: number) {
    const actionDisabled = await this.actions_repository.disableAction(idAction);
    if (!actionDisabled) {
      return { ok: false, status: 404, message: "La acción que desea desactivar no existe", error: { message: "La acción no existe en la aplicación" } };
    }
    if (actionDisabled.status > 0) {
      return { ok: false, status: 204, message: "No se pudo desactivar esta acción", error: { message: "no cambió de valor el status del registro" } };
    }
    return { ok: true, status: 200, message: "Acción desactivada con exito", datos: { ...actionDisabled } };
  }

  async editAction(idAction: number, body: UpdateActionData) {
    const actionFound = await this.actions_repository.getOneActionByIdAction(idAction);
    if (!actionFound) {
      return { ok: false, message: "Acción no encontrada", status: 404, error: { message: "Esta acción no existe en la aplicacion" } };
    }
    const responseUpdated = await this.actions_repository.editAction(idAction, body);
    if (responseUpdated["affected"] === 0) {
      return { ok: false, status: 204, message: "No se pudo editar la acción", error: { message: "Hubo un error al editar la acción" } };
    }
    const actionUpdated = await this.actions_repository.getOneActionByIdAction(idAction);
    return { ok: true, status: 200, message: "Action editada con exito", datos: { ...actionUpdated } };
  }

  async deleteAction(idAction: number) {
    const actionFound = await this.actions_repository.getOneActionByIdAction(idAction);
    if (!actionFound) {
      return { ok: false, status: 404, message: "Acción no existente" };
    }
    const responseDeleted = await this.actions_repository.deleteAction(idAction);
    if (responseDeleted["affected"] === 0) {
      return { ok: false, message: "No se pudo eliminar la acción", status: 204, error: { message: "se produjo un error al eliminar la acción" } };
    }
    return { ok: true, status: 200, message: "Acción eliminada con exito" };
  }

  async deleteAllAction() {
    const responseDeleted = await this.actions_repository.deleteAllAction();
    if (responseDeleted.length > 0) {
      return { ok: false, message: "No se pudieron eliminar las acciones" };
    }
    return { ok: true, status: 200, message: "Acciones eliminadas con exito", datos: [...responseDeleted] };
  }

  async getOneActionByIdAction(idAction: number) {
    const actionFound = await this.actions_repository.getOneActionByIdAction(idAction);
    if (!actionFound) {
      return { ok: false, status: 404, message: "Acción no encontrada", error: { message: "Esta acción no existe en la db" } };
    }
    return { ok: true, status: 200, message: "acción encontrada", datos: { ...actionFound } };
  }

  async getAllActions() {
    const actions = await this.actions_repository.getAllActions();
    if (actions.length === 0) {
      return { ok: false, status: 204, message: "No existe ninguna acción registrada", error: { message: "actualmente no existen acciones en la db" } };
    }
    return { ok: true, message: "Acciones encontradas", status: 200, datos: [...actions] };
  }

  async createAction(body: ActionsData) {
    const actionCreated = await this.actions_repository.createAction(body);
    if (!actionCreated) {
      return { ok: false, status: 204, message: "No se pudo crear la acción", error: { message: "se produjo un error al crear la acción" } };
    }
    return { ok: true, status: 200, message: "accion creada con exito", datos: { ...actionCreated } };
  }


  //MENU

  async getAllMenusDb() {
    const menus=await this.menu.getAllMenusDb();
    if(menus.length===0){
      return {ok:false,status:204,message:"No se encontradron menu registrados en la aplicación"};
    }
    return {ok:true,status:200,message:"Registros encontrados",datos:[...menus]};
  }

  async getAllMenuAccordingStatus(status: number) {
    if(status<0 || status>1){
      return {ok:false,status:203,message:"Valor de status no valido (0 inactivos 1 activos) "};
    }
    const listMenu = await this.menu.getAllMenusDb();
    if(listMenu.length===0){
      return {ok:false,status:204,message:"No hay menu registrados en la aplicación"};
    }
    const response=await this.menu.getAllMenuAccordingStatus(status);
    return {ok:true,status:200,message:"Registros encontrados en la aplicación",datos:[...response]};
  }

  async getMenuByName(name: string) {
    return await this.menu.getMenuByName(name);
  }

  async createMenu(newMenu: menuData, subMenus: subMenuData[]) {
    try {
      const menuDb = await this.menu.createMenu(newMenu);
      if (menuDb) {
        const id = menuDb.id;
        const subs = await Promise.all(
          subMenus.map(async (item) => {
            item.menu_id = id;
            const { roles, ...datos } = item
            const s = await this.sub_menu.createSubMenu(datos);
            let i = 0;
            await Promise.all(roles.map(async rol => {
              await this.menu_rol_repo.createMenuRol({ id_rol: rol, sub_menu_id: s.id });
            }))
            return s;
          })
        );
        const DataRes: menuDataComplete = { ...menuDb, submenus: subs }
        return {
          ok: true,
          message: "Menu creado correctamente",
          datos: DataRes,
        };
      }
    } catch (error) {
      return {
        ok: false,
        message: error.message,
        error,
      };
    }
  }

  async createSubMenu(idMenu: number, subMenus: subMenuData[]) {
    try {
      const menuDb = await this.menu.getMenuById(idMenu);
      if (menuDb) {
        const id = idMenu;
        const subs = await Promise.all(
          subMenus.map(async (item) => {
            item.menu_id = id;
            const { roles, ...datos } = item
            const s = await this.sub_menu.createSubMenu(datos);
            let i = 0;
            await Promise.all(roles.map(async rol => {
              await this.menu_rol_repo.createMenuRol({ id_rol: rol, sub_menu_id: s.id });
            }))
            return s;
          })
        );
        const DataRes: menuDataComplete = { ...menuDb, submenus: subs }
        return {
          ok: true,
          message: "Sub menu creado correctamente",
          datos: DataRes,
        };
      }
    } catch (error) {
      return {
        ok: false,
        message: error.message,
        error,
      };
    }
  }

  async inhabilitarMenu(menu_id: number) {
    try {
      const menu_find = await this.menu.getMenuById(menu_id);
      menu_find.status = 0;
      const update = await this.menu.updateMenu(menu_id, menu_find);
      if (update) {
        return {
          ok: true,
          message: "Menu inhabilitado correctamente",
          datos: { ...update },
        };
      }
    } catch (error) {
      return {
        ok: false,
        message: error.message,
        error,
      };
    }
  }

  async habilitarMenu(menu_id: number) {
    try {
      const menu_find = await this.menu.getMenuById(menu_id);
      menu_find.status = 1;
      const update = await this.menu.updateMenu(menu_id, menu_find);
      if (update) {
        return {
          ok: true,
          message: "Menu habilitado correctamente",
          datos: { ...update },
        };
      }
    } catch (error) {
      return {
        ok: false,
        message: error.message,
        error,
      };
    }
  }

  async getAllMenus(rol_id: number) {
    return await this.menu.getAllMenu(rol_id);
  }

  async moveSubMenu(data: moveSubMenu[]) {
    const count = 0;
    await Promise.all(data.map(async payload => {
      const subMenu = await this.sub_menu.getSubMenuById(payload.id_sub);
      if (!subMenu) {
        return {
          ok: false,
          message: "Sub menú no encontrado",
          error: subMenu,
        };
      }

      subMenu.menu_id = payload.id_destination;
      const update = await this.sub_menu.updateSubMenu(payload.id_sub, subMenu);
    }))
    return {
      ok: true,
      message: "Sub menú movido correctamente",
      datos: { message: "Sub menú movido correctamente" },
    };
  }

  async updateSubMenu(id: number, payload: UpdateSubMenuData) {
    const subMenuUpdated = await this.sub_menu.updateSubMenu(id, payload);
    if (!subMenuUpdated) {
      return { ok: false, status: 404, message: "No se pudo actualizar" };
    }
    return { ok: true, status: 200, message: "Actualizado con exito" };

  }

  async deleteSubMenuById(idSubMenu: number): Promise<any> {
    const responseDeleted = await this.sub_menu.deleteSubMenuById(idSubMenu);
    if (responseDeleted["affected"] === 0) {
      return { ok: false, status: 404, message: "Sub menu no existente" };
    }
    return { ok: true, status: 200, message: "Sub menu eliminado con exito" };
  }

  async getSubMenuByIdForm(idForm: number) {
    return await this.sub_menu.getSubMenuByIdForm(idForm);
  }
}
