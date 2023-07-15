import {
  configCustomerDb,
  updateConfigCustomer,
  updateConfigCustomerDb
} from "../entities/config_custom.entity";
import { v4 as uuid } from "uuid";


export class ConfigCustomerData {
  id?: number;
  customer_id: number;
  primary_color?: string;
  secondary_color?: string;
  tertiary_color?: string;
  dark_mode?: boolean;
  // icon_menu?: string;
  font_family?: string;
  status?: number;
  constructor({
    customer_id,
    primary_color,
    secondary_color,
    tertiary_color,
    dark_mode,
    // icon_menu,
    font_family,
  }: {
    id?: number;
    customer_id: number;
    primary_color?: string;
    secondary_color?: string;
    dark_mode?: boolean;
    tertiary_color?: string;
    // icon_menu?: string;
    font_family?: string;
    status?: number;
  }) {
    this.id = uuid();
    this.customer_id = customer_id;
    this.primary_color = primary_color;
    this.secondary_color = secondary_color;
    this.tertiary_color = tertiary_color;
    this.dark_mode = dark_mode;
    // this.icon_menu = icon_menu;
    this.font_family = font_family;
    this.status = 1;
  }
}

export class ConfigCustomerDb implements configCustomerDb {
  id?: number;
  customer_id: number;
  primary_color: string;
  secondary_color: string;
  tertiary_color: string;
  icon_menu: Buffer;
  dark_mode: boolean;
  font_family: string;
  status?: number;
  constructor({
    id,
    customer_id,
    primary_color,
    secondary_color,
    dark_mode,
    tertiary_color,
    icon_menu,
    font_family,
    status,
  }: {
    id?: number;
    customer_id: number;
    primary_color: string;
    secondary_color: string;
    tertiary_color: string;
    dark_mode: boolean;
    icon_menu: Buffer;
    font_family: string;
    status?: number;
  }) {
    this.id = id;
    this.customer_id = customer_id;
    this.primary_color = primary_color;
    this.secondary_color = secondary_color;
    this.tertiary_color = tertiary_color;
    this.dark_mode = dark_mode;
    this.icon_menu = icon_menu;
    this.font_family = font_family;
    this.status = status;
  }
}

export class UpdateConfigCustomer implements updateConfigCustomer {
  primary_color?: string;
  secondary_color?: string;
  tertiary_color?: string;
  // icon_menu?: string;
  font_family?: string;
  status?: number;
  constructor({
    primary_color,
    secondary_color,
    tertiary_color,
    // icon_menu,
    font_family,
    status,
  }: {
    id?: number;
    customer_id?: number;
    primary_color?: string;
    secondary_color?: string;
    tertiary_color?: string;
    // icon_menu?: string;
    font_family?: string;
    status?: number;
  }) {

    this.primary_color = primary_color;
    this.secondary_color = secondary_color;
    this.tertiary_color = tertiary_color;
    // this.icon_menu = icon_menu;
    this.font_family = font_family;
    this.status = status;
  }
}


export class UpdateConfigCustomerDb implements updateConfigCustomerDb {
  primary_color?: string;
  secondary_color?: string;
  tertiary_color?: string;
  // icon_menu?: Buffer;
  font_family?: string;
  status?: number;
  constructor({
    primary_color,
    secondary_color,
    tertiary_color,
    // icon_menu,
    font_family,
    status,
  }: {
    id?: number;
    customer_id?: number;
    primary_color?: string;
    secondary_color?: string;
    tertiary_color?: string;
    // icon_menu?: Buffer;
    font_family?: string;
    status?: number;
  }) {
    this.primary_color = primary_color;
    this.secondary_color = secondary_color;
    this.tertiary_color = tertiary_color;
    // this.icon_menu = icon_menu;
    this.font_family = font_family;
    this.status = status;
  }
}
