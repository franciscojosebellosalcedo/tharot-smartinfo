import { contractsModuloEntity } from "../entities/contracts_modulo.entity";
import { v4 as uuid } from "uuid";

export class UpdateContractModuloData {
  id_customer?: number;
  id_modulo?: number;
  date_expiration?: Date;
  price?: number;

  constructor({
    id_customer,
    id_modulo,
    date_expiration,
    price
  }: {
    id_customer?: number;
    id_modulo?: number;
    date_expiration?: Date;
    price?: number;
  }) {
    this.date_expiration=date_expiration;
    this.id_customer=id_customer;
    this.id_modulo=id_modulo;
    this.price=price;
  }
}

export class ExtendDateContractData {
  date: Date;
  constructor({ date }: { date: Date }) { this.date = date }
}
export class ContractsModuloData implements contractsModuloEntity {
  id?: number;
  id_customer: number;
  id_modulo: number;
  date_expiration: Date;
  date_contract?: Date;
  validity?: string;
  price: number;
  status?: number;

  constructor({
    id_customer,
    id_modulo,
    date_expiration,
    date_contract,
    validity,
    price
  }: {
    id_customer: number;
    id_modulo: number;
    date_expiration: Date;
    date_contract?: Date;
    validity?: string;
    price: number;
  }) {
    this.id = uuid();
    this.id_customer = id_customer;
    this.id_modulo = id_modulo;
    this.date_expiration = date_expiration;
    this.validity = validity;
    this.date_contract = date_contract;
    this.price = price;
    this.status = 1;
  }

}

export class UpdateContractsModuloData {
  id_customer?: number;
  id_modulo?: number;
  date_expiration?: Date;
  validity?: string;
  price?: number;

  constructor({
    id_customer,
    id_modulo,
    date_expiration,
    validity,
    price
  }: {
    id_customer?: number;
    id_modulo?: number;
    date_expiration?: Date;
    validity?: string;
    price?: number;
  }) {
    this.id_customer = id_customer;
    this.id_modulo = id_modulo;
    this.date_expiration = date_expiration;
    this.validity = validity;
    this.price = price;
  }

}