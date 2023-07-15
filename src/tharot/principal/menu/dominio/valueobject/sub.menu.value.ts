import { sub_menu, move_sub_menu } from "../entities/sub.menu.entity";

export class moveSubMenu implements move_sub_menu {
  id_sub: number;
  id_destination: number;

  constructor({
    id_sub,
    id_destination,
  }: {
    id_sub: number;
    id_destination: number;
  }) {
    this.id_sub = id_sub;
    this.id_destination = id_destination;
  }
}

export class subMenuData implements sub_menu {
  id?: number;
  menu_id: number;
  name: string;
  orden: number;
  acciones: string;
  status?: number;
  roles?: number[];
  type_form?: number;
  id_form?: number;
  constructor({
    menu_id,
    name,
    orden,
    acciones,
    status,
    type_form,
    id_form,
    roles,
  }: {
    menu_id: number;
    name: string;
    orden: number;
    acciones: string;
    status?: number;
    roles?: number[];
    type_form?: number;
    id_form?: number;
  }) {
    this.menu_id = menu_id;
    this.name = name;
    this.orden = orden;
    this.acciones = acciones;
    this.status = status;
    this.id_form= id_form;
    this.type_form= type_form;
    this.roles = roles;
  }

}

export class UpdateSubMenuData {
  menu_id?: number;
  name?: string;
  orden?: number;
  acciones?: string;
  status?: number;
  constructor({
    menu_id,
    name,
    orden,
    acciones,
    status,
  }: {
    menu_id?: number;
    name?: string;
    orden?: number;
    acciones?: string;
    status?: number;
  }) {
    this.menu_id = menu_id;
    this.name = name;
    this.orden = orden;
    this.acciones = acciones;
    this.status = status;
  }
}
