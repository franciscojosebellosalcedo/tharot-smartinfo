import { Controller, Get, Param, Body, Post, Patch, Delete } from '@nestjs/common';
import { MenuService } from "../servicios/menu.service";
import { SubMenuService } from "../servicios/sub_menu.service";
import { MenuCaso } from "../../aplicasion/menu.casouso";
import { MenuRolService } from "../../../menu_rol/infraestructura/servicios/menu_rol.service";
import { menuComplete, UpdateMenuDto } from "../dtos/menus.dto";
import { CreateMenuRolDto } from "../../../menu_rol/infraestructura/dtos/menu_rol.dto";
import { ApiTags } from "@nestjs/swagger";
import { MenuRolCaso } from '../../../menu_rol/aplicasion/menu_rol.casouso';
import { MoveSubMenuDto } from '../dtos/sub_menus.dto';
import { ActionsService } from '../servicios/actions.service';
import { CreateActionsDto, UpdateActionDto } from '../dtos/actions.dto';
import { ActionsMenuService } from '../servicios/actions_menu.service';
import { CreatedActionsSubMenu } from '../dtos/actions_menu.dto';

@ApiTags("Menu")
@Controller("menu")
export class MenuController {
  private readonly menu_caso: MenuCaso;
  private readonly menu_rol_caso: MenuRolCaso
  constructor(
    private readonly _menu: MenuService,
    private readonly _sub_menu: SubMenuService,
    private readonly _menu_rol: MenuRolService,
    private readonly _actions: ActionsService,
    private readonly _actions_menu: ActionsMenuService
  ) {
    this.menu_rol_caso = new MenuRolCaso(this._menu_rol)
    this.menu_caso = new MenuCaso(this._menu, this._sub_menu, this._menu_rol, this._actions, this._actions_menu);
  }

  //ACTIONS MENU
  @Get("actionMenu-all")
  async getAllActionMenu() {
    return await this.menu_caso.getAllActionMenu();
  }
  @Get("actionMenu-get-one-by-idActionMenu/:idActionMenu")
  async getOneActionMenuById(@Param() param) {
    return await this.menu_caso.getOneActionMenuById(parseInt(param.idActionMenu));
  }

  @Get("actionMenu-all-by-idSubMenu/:idSubMenu")
  async getAllActionMenuByIdSubMenu(@Param() param) {
    return await this.menu_caso.getAllActionMenuByIdSubMenu(parseInt(param.idSubMenu));
  }

  @Get("actionMenu-all-by-idAction/:idAction")
  async getAllActionMenuByIdAction(@Param() param) {
    return await this.menu_caso.getAllActionMenuByIdAction(parseInt(param.idAction));
  }

  @Patch("actionMenu-enable/:idActionMenu")
  async enableActionMenuById(@Param() param) {
    return await this.menu_caso.enableActionMenuById(parseInt(param.idActionMenu));
  }

  @Patch("actionMenu-disable/:idActionMenu")
  async disableActionMenuById(@Param() param) {
    return await this.menu_caso.disableActionMenuById(parseInt(param.idActionMenu));
  }

  @Post("actionMenu")
  async createActionMenu(@Body() body: CreatedActionsSubMenu) {
    return await this.menu_caso.createActionMenu(body);
  }

  //ACTIONS
  @Patch("actions-enable/:idAction")
  async enableAction(@Param() param) {
    return await this.menu_caso.enableAction(parseInt(param.idAction));
  }

  @Patch("actions-disable/:idAction")
  async disableAction(@Param() param) {
    return await this.menu_caso.disableAction(parseInt(param.idAction));
  }

  @Patch("actions-edit-byId/:idAction")
  async editAction(@Param() param, @Body() body: UpdateActionDto) {
    return await this.menu_caso.editAction(parseInt(param.idAction), body);
  }

  @Delete("actions-delete-one/:idAction")
  async deleteAction(@Param() param) {
    return await this.menu_caso.deleteAction(parseInt(param.idAction));
  }

  @Delete("actions-delete-all")
  async deleteAllAction() {
    return await this.menu_caso.deleteAllAction();
  }

  @Get("actions/:idAction")
  async getOneActionByIdAction(@Param() param) {
    return await this.menu_caso.getOneActionByIdAction(parseInt(param.idAction));
  }

  @Get("actions")
  async getAllActions() {
    return await this.menu_caso.getAllActions();
  }

  @Post("actions")
  async createAction(@Body() body: CreateActionsDto) {
    return await this.menu_caso.createAction(body);
  }


  //MENU

  @Post()
  async createMenu(
    @Body() payload: menuComplete
  ) {
    return await this.menu_caso.createMenu(payload.menu, payload.sub_menu);
  }

  @Post("/add/permission")
  async addPermissionMenu(
    @Body() payload: CreateMenuRolDto
  ) {
    return await this.menu_rol_caso.createPermiso(payload);
  }

  @Post("/move/submenu")
  async moveSubMenu(
    @Body() payload: MoveSubMenuDto[]
  ) {
    return await this.menu_caso.moveSubMenu(payload);
  }

  @Get("all/accordingStatus/:status")
  async getAllMenuAccordingStatus(@Param() param) {
    return await this.menu_caso.getAllMenuAccordingStatus(parseInt(param.status));
  }

  @Get("/:id")
  async getAll(@Param("id") id_rol: number) {
    return await this.menu_caso.getAllMenus(id_rol);
  }

  @Patch("/submenu/:id")
  async updateSubMenu(@Body() payload: UpdateMenuDto, @Param("id") id: number) {
    return await this.menu_caso.updateSubMenu(id, payload);
  }

  @Patch("/:id")
  async updateMenu(@Body() payload: UpdateMenuDto, @Param("id") id: number) {
    return await this.menu_caso.updateSubMenu(id, payload);
  }
}
