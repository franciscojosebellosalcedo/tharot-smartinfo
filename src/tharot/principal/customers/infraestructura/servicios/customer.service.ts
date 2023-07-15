import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { sign } from "jsonwebtoken";
import { Repository } from "typeorm";
import { InterfaceCustomersRepository } from "../../dominio/repository/customers.repository";
import { CustomersData, UpdateCustomersData } from "../../dominio/valueobject/customers.value";
import { CustomersModel } from "../modelos/customers.model";
//servicio de customer para ejectar los casos de usos
@Injectable()
export class CustomersService implements InterfaceCustomersRepository {
  constructor(@InjectRepository(CustomersModel) private _customerRepository: Repository<CustomersModel>) {
  }

  async getCustomerBy_Id(customerId: number): Promise<CustomersData> {
    return await this._customerRepository.findOneBy({id: customerId});
  }

  async deleteCustomerById(customerId: number): Promise<any> {
    return await this._customerRepository.delete({id:customerId});
  }

  async deleteAllCustomers(idCustomer:number): Promise<any> {
    const listCustomer=await this._customerRepository.find();
    if(idCustomer===0){
      return listCustomer;
    }
    return listCustomer.filter((cus)=>cus.id !== idCustomer);
  }

  async getAllCustomersAccordingStatus(status: number): Promise<CustomersData[]> {
    return await this._customerRepository.find({where:{status:status}});
  }

  async enableCustomer(customerId: number): Promise<any> {
    const customerFound = await this._customerRepository.findOne({ where: { id: customerId } });
    if (!customerFound) {
      return {
        msg: "Empresa no encontrada", ok: false
      }
    }
    if (customerFound.status === 1) {
      return {
        msg: "Empresa ya está activa", ok: false, data: customerFound
      }
    }
    customerFound.status = 1;
    await this._customerRepository.save(customerFound);
    return {
      msg: "Empresa activada con exito", ok: true, data: customerFound
    }
  }

  //crea un customer
  async createCustomer(newCustomer: CustomersData): Promise<CustomersModel | any> {
    if (newCustomer.nit) {
      if (newCustomer.nit.length < 11) {
        return {
          message: "El NIT de la empresa no debe de tener menos de 11 caracteres", ok: false, status: 200, error: "Este NIT no es correcto"
        }
      }
      if (newCustomer.nit.length > 13) {
        return {
          message: "El NIT de la empresa no debe de tener más de 13 caracteres", ok: false, status: 200, error: "Este NIT no es correcto"
        }
      }
    }
    const customerFindByNit = await this._customerRepository.findOne({ where: { nit: newCustomer.nit } });
    if (customerFindByNit) {
      return {
        ok: false,
        message: "Empresa ya existente",
        status: 200,
        error: { message: "Esta empresa (customer) ya existe en la base de datos" }
      }
    }
    const customerFindByEmail = await this._customerRepository.findOne({ where: { email: newCustomer.email } });
    if (customerFindByEmail) {
      return {
        ok: false,
        message: "No se pudo agregar esta empresa con este correo electrónico, por favor ingrese un correo electrónico diferente",
        status: 200,
        error: { message: "Este correo de esta empresa (customer) ya existe en la base de datos" }
      }
    }

    const Customer = this._customerRepository.create(newCustomer);
    const customerCreated = await this._customerRepository.save(Customer);
    return { message: "Empresa creada con exito", data: customerCreated, ok: true };
  }
  //elimina un customer
  async deleteCustomer(customerId: number): Promise<CustomersModel | any> {
    const customerDeleted = await this._customerRepository.findOne({ where: { id: customerId } });
    if (!customerDeleted) return new NotFoundException();
    customerDeleted.status = 0;
    const change_status = await this._customerRepository.save(customerDeleted);
    return change_status;
  }
  //obtiene los customer
  async getAllCustomers(): Promise<CustomersData[] | any> {
    const customers = await this._customerRepository.find();
    return customers;
  }
  //edita un customer
  async updateCustomer(customerId: number, newData: UpdateCustomersData): Promise<CustomersData | any> {
    if (newData.nit) {
      if (newData.nit.length < 11) {
        return {
          message: "El NIT de la empresa no debe de tener menos de 11 caracteres", ok: false, status: 200, error: "Este NIT no es correcto"
        }
      }
      if (newData.nit.length > 13) {
        return {
          message: "El NIT de la empresa no debe de tener más de 13 caracteres", ok: false, status: 200, error: "Este NIT no es correcto"
        }
      }
    }
    const custumerUpdated = await this._customerRepository.update(customerId, newData);
    if (custumerUpdated["affected"] === 0) return { message: "No se pudo editar la empresa", ok: false };
    const dataCustomerUpdated = await this._customerRepository.findOne({ where: { id: customerId } });
    const token = sign(
      {
        data: { ...dataCustomerUpdated }
      }
      , process.env.SECRET_KEY, { algorithm: "HS256" });
    return {
      message: "Empresa editada con exito", ok: true, data: token
    };
  }
  //obtiene un unico customer
  async getCustomerById(customerId: number): Promise<CustomersData | any> {
    const customerFound = this._customerRepository.findOne({ where: { id: customerId } });
    return customerFound;
  }

  async countCustomer(): Promise<any> {
    return await this._customerRepository.count();
  }

}
