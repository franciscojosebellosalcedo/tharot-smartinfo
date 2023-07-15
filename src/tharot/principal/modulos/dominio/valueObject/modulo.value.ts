import { moduloEntity } from "../entities/modulo.entity";
import { v4 as uuid } from "uuid";

export class ModuloData implements moduloEntity {
  id?: number;
  name: string;
  description: string;
  status?: number;
  constructor({
    name,
    description,
  }: {
    id?: number;
    name: string;
    description: string;
    status?: number;
  }) {
    this.id = uuid();
    this.name = name;
    this.description = description;
    this.status = 1;
  }
}

export class UpdateModuloData {
  name?: string;
  description?: string;
  constructor({
    name,
    description,
  }: {
    name?: string;
    description?: string;
  }) {
    this.name = name;
    this.description = description;
  }
}