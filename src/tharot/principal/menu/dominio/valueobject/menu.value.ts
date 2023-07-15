import { menu } from "../entities/menu.entity";
import { subMenuData } from "../valueobject/sub.menu.value";

export class menuData implements menu {
  id?: number;
  modulo_id?: number;
  name: string;
  ubicacion: number;
  status?: number;

  constructor({
    id,
    modulo_id,
    name,
    ubicacion,
    status,
  }: {
    modulo_id?: number;
    id?: number;
    name: string;
    ubicacion: number;
    status?: number;
  }) {
    this.modulo_id = modulo_id;
    this.name = name;
    this.id=id;
    this.ubicacion = ubicacion;
    this.status = status;
  }
}

export class UpdateMenuData {
  modulo_id?: number;
  name?: string;
  ubicacion?: number;
  status?: number;
  constructor({
    modulo_id,
    name,
    ubicacion,
    status,
  }: {
    modulo_id?: number;
    name?: string;
    ubicacion?: number;
    status?: number;
  }) {
    this.modulo_id = modulo_id;
    this.name = name;
    this.ubicacion = ubicacion;
    this.status = status;
  }
}

export class menuDataComplete implements menu {
  modulo_id?: number;
  name: string;
  ubicacion: number;
  submenus: subMenuData[];

  constructor({
    modulo_id,
    name,
    ubicacion,
    submenus,
  }: {
    modulo_id?: number;
    name: string;
    ubicacion: number;
    submenus: subMenuData[];
  }) {
    this.modulo_id = modulo_id;
    this.name = name;
    this.ubicacion = ubicacion;
    this.submenus = submenus;
  }
}







