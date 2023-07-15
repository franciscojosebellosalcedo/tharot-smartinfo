import { mc, mc_update } from "../entities/mc.entity";

export class McData implements mc {
  method_id: number;
  customer_id: number;
  status?: number;

  constructor({
    method_id,
    customer_id,
  }: {
    method_id: number;
    customer_id: number;
  }){
    this.method_id = method_id;
    this.customer_id = customer_id;
    this.status = 1;
  }
}

export class McUpdateData implements mc_update {
    method_id?: number;
    customer_id?: number;
    status?: number;
  
    constructor({
      method_id,
      customer_id,
      status
    }: {
      method_id?: number;
      customer_id?: number;
      status?: number;
    }){
      this.method_id = method_id;
      this.customer_id = customer_id;
      this.status = status;
    }
  }
