import { createCampo, updateCampo } from "../entities/campo.entity";

export class CampoData implements createCampo {
  id?: number;
  form_id?: number;
  label: string;
  name_bd: string;
  type: string;
  format: string;
  required: number;
  order: number;
  unique: number;
  max_length: number;
  width: string;
  options?: string;
  status?: number;

  constructor({
    id,
    form_id,
    label,
    name_bd,
    type,
    format,
    required,
    order,
    unique,
    max_length,
    width,
    options,
  }: {
    form_id?: number;
    id?: number;
    label: string;
    name_bd: string;
    type: string;
    format: string;
    required: number;
    order: number;
    unique: number;
    max_length: number;
    width: string;
    options?:string;
  }) {
    this.form_id = form_id;
    this.label = label;
    this.name_bd = name_bd;
    this.type = type;
    this.format = format;
    this.required = required;
    this.order = order;
    this.unique = unique;
    this.max_length = max_length;
    this.width = width;
    this.id=id;
    this.options=options;
    this.status = 1;
  }
}

export class UpdateCampo implements updateCampo {
  label?: string;
  name_bd?: string;
  type?: string;
  format?: string;
  required?: number;
  order?: number;
  unique?: number;
  max_length?: number;
  width?: string;
  options?: string;
  status?: number;

  constructor({
    label,
    name_bd,
    type,
    format,
    required,
    order,
    unique,
    max_length,
    width,
    options,
    status,
  } : {
    label?: string;
    name_bd?: string;
    type?: string;
    format?: string;
    required?: number;
    order?: number;
    unique?: number;
    max_length?: number;
    width?: string;
    options?: string;
    status?: number
  }) {
    this.label = label;
    this.name_bd = name_bd;
    this.type = type;
    this.format = format;
    this.required = required;
    this.order = order;
    this.unique = unique;
    this.max_length = max_length;
    this.width = width;
    this.options = options;
    this.status = status;
  }
}
