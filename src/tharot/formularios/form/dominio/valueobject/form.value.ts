import { createForm, updateForm } from "../entities/form.entity";

export class FormData implements createForm {
  id?:number;
  customer_id: number;
  titulo: string;
  table_db: string;
  delete_reg: number;
  status?: number;

  constructor({
    customer,
    titulo,
    tabla,
    delete_r,
  }: {
    customer: number;
    titulo: string;
    tabla: string;
    delete_r: number;
  }) {
    this.customer_id = customer;
    this.titulo = titulo;
    this.table_db = tabla;
    this.delete_reg = delete_r;
    this.status = 1;
  }
}

export class UpdateForm implements updateForm {
    customer_id ?: number;
    titulo ?: string;
    table_db ?: string;
    delete_reg ?: number;
    status ?: number;
  
    constructor({
      customer,
      titulo,
      tabla,
      delete_r,
      status
    } : {
      customer ?: number;
      titulo ?: string;
      tabla ?: string;
      delete_r ?: number;
      status ?: number;
    }) {
      this.customer_id = customer;
      this.titulo = titulo;
      this.table_db = tabla;
      this.delete_reg = delete_r;
      this.status = status;
    }
}
