import { rol, updateRol } from "../entities/rol.entity";
export class RolData implements rol {
  id?: number;
  name: string;
  level: number;
  status?: number;
  constructor({ name, level }: { name: string; level: number }) {
    this.name = name;
    this.level = level;
    this.status = 1;
  }
}

export class UpdateRol implements updateRol {
  name?: string;
  level?: number;
  status?: number;
  constructor({
    name,
    level,
    status,
  }: {
    name?: string;
    level?: number;
    status?: number;
  }) {
    this.name = name;
    this.level = level;
    this.status = status;
  }
}
