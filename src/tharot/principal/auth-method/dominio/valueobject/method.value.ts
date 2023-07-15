import { method, methodUpdate } from "../entities/method.entity";
export class MethodData implements method {
  id?: number;
  name: string;
  status?: number;
  constructor({ name,id }: { name: string;id:number }) {
    this.id = id;
    this.name = name;
    this.status = 1;
  }
}

export class UpdateMethod implements methodUpdate {
  name?: string;
  status?: number;
  constructor({
    name,
    status,
  }: {
    name?: string;
    status?: number;
  }) {
    this.name = name;
    this.status = status;
  }
}
