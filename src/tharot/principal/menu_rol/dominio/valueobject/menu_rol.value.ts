import { menu_rol } from "../entities/menu_rol.entity";

export class menuRolData implements menu_rol {
  id?: number;
  id_rol: number;
  sub_menu_id: number;
  status?: number;
  constructor({
    id,
    id_rol,
    sub_menu_id,
    status,
  }: {
    id?: number;
    id_rol: number;
    sub_menu_id: number;
    status?: number;
  }) {
    this.id = id;
    this.id_rol = id_rol;
    this.sub_menu_id = sub_menu_id;
    this.status = status;
  }
}

export class UpdateMenuRolData {
  id?: number;
  id_rol?: number;
  sub_menu_id?: number;
  status?: number;
  constructor({
    id,
    id_rol,
    sub_menu_id,
    status,
  }: {
    id?: number;
    id_rol?: number;
    sub_menu_id?: number;
    status?: number;
  }) {
    this.id = id;
    this.id_rol = id_rol;
    this.sub_menu_id = sub_menu_id;
    this.status = status;
  }
}