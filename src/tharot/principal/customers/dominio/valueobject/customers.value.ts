import { InterfaceEntityCustomers } from "../entities/customers.entity";
import { v4 as uuid } from 'uuid';
//clase con los datos de customer inicializados


export class MethodsAvaiblesCustomer {
  codeCustomer: string;
  constructor({ codeCustomer }: { codeCustomer: string }) {
    this.codeCustomer = codeCustomer;
  }
}

export class CustomersData implements InterfaceEntityCustomers {
  id?: number;
  logo?: Buffer;
  nit: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  methods?: number[];
  status?: number;
  //inicializacion de los datos de customer
  constructor({ logo, nit, name, address, email, methods, phone }: {
    logo?: Buffer, nit: string, code_customer?: string, name: string, address: string,
    phone: string, email: string, methods?: []
  }) {
    this.id = uuid();
    this.logo = logo;
    this.nit = nit;
    this.name = name;
    this.address = address;
    this.phone = phone;
    this.email = email;
    this.status = 1;
    this.methods = methods;
  }
}
export class UpdateCustomersData {
  logo?: Buffer;
  nit?: string;
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  methods?: []
  constructor({ logo, nit, name, address, email, phone,methods }: {
    logo?: Buffer, nit: string, name: string, address: string,methods?: []
    phone: string, email: string,
  }) {
    this.logo = logo;
    this.nit = nit;
    this.name = name;
    this.address = address;
    this.methods= methods;
    this.phone = phone;
    this.email = email;
  }
}


