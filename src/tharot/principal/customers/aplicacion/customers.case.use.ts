
import { InterfaceCustomersRepository } from "../dominio/repository/customers.repository";
import { MethodService } from "../../auth-method/infraestructura/servicios/method.service";
import { MethodCasoUso } from "../../auth-method/aplicacion/method.casouso";
import { McService } from "../../method-customer/infraestructura/servicios/mc.service";
import { McCasoUso } from "../../method-customer/aplicacion/mc.casouso";
import { CustomersData, UpdateCustomersData } from "../dominio/valueobject/customers.value";
import { sign } from "jsonwebtoken";

//en esta clase se ejecutan los casos de usos de la entidad Customer
export class CustomersCaseUse {
  methodCaseUse: MethodCasoUso;
  mcCaseUse: McCasoUso;
  constructor(
    private readonly customerRepository: InterfaceCustomersRepository,
    private methodService?: MethodService,
    private mcService?: McService,
  ) {
    this.methodCaseUse = new MethodCasoUso(this.methodService);
    this.mcCaseUse = new McCasoUso(this.mcService);
  }

  async getCustomerBy_Id(customerId: number) {
    return await this.customerRepository.getCustomerBy_Id(customerId);
  }

  async getAllCustomersAccordingStatus(status: number) {
    if (status < 0 || status > 1) {
      return { ok: false, status: 203, message: "Valor del status es incorrecto (0 inactivo y 1 activo)" };
    }
    const listCustomers = await this.customerRepository.getAllCustomersAccordingStatus(status);
    return { ok: true, status: 200, message: "Empresas registradas", datos: [...listCustomers] };
  }

  async deleteAllCustomers(idCustomer: number) {
    const customerFound = await this.customerRepository.getCustomerById(idCustomer);
    if (!customerFound) {
      return { ok: false, status: 404, message: "La empresa que desea eliminar todo los registros no existe en la aplicación" };
    } else if (customerFound.status === 0) {
      return { ok: false, status: 203, message: "La empresa que desea eliminar todo actualmente esta deshabilitada en la aplicación" };
    }
    const listCustomers = await this.customerRepository.getAllCustomers();
    if (listCustomers.length === 0) {
      return { ok: false, status: 204, message: "No existe ninguna empresa en la aplicación" };
    }
    const response = await this.customerRepository.deleteAllCustomers(idCustomer);
    for (let i = 0; i < response.length; i++) {
      const customer: CustomersData = response[i];
      await this.deleteCustomerById(customer.id);
    }
    const listCustomersRenoved = await this.customerRepository.getAllCustomers();
    console.log(listCustomersRenoved);
    if (listCustomersRenoved.length > 1) {
      return { ok: false, status: 200, message: "No se eliminó ninguna empresa de la aplicación " };
    }
    return { ok: true, status: 200, message: "Todas las empresas se eliminaron con exito" };

  }

  async enableCustomer(customerId: number) {
    const customerEnabled = await this.customerRepository.enableCustomer(customerId);
    return customerEnabled;
  }

  async createCustomer(newCustomer: CustomersData) {
    newCustomer.name = newCustomer.name.trim();
    newCustomer.nit = newCustomer.nit.trim();
    newCustomer.address = newCustomer.address.trim();
    newCustomer.phone = newCustomer.phone.trim();
    newCustomer.email = newCustomer.email.trim();
    //lista de id de los metodos de autenticacion seleccionados para este customer (array)
    const listIdMethods = newCustomer.methods;
    //array donde se almacenaran los valores unicos del array listIdMethods (id no repetidos)
    let uniques = [];
    //algoritmo para sacar los id unicos del array listIdMethods
    for (let i = 0; i < listIdMethods.length; i++) {
      const element = listIdMethods[i];
      if (!uniques.includes(listIdMethods[i])) {
        uniques.push(element);
      }
    }

    const validationIdMethos = await this.methodCaseUse.validateMethods(uniques);
    if (validationIdMethos.ok === true) {
      const customer = await this.customerRepository.createCustomer(newCustomer);
      if (customer.ok === false) {
        return { message: customer.message, ok: false, status: customer.status, error: { message: customer.error } };
      }
      for (let i = 0; i < uniques.length; i++) {
        const methodId = uniques[i];
        const methodDB = await this.methodCaseUse.getMethod(methodId);
        const methodCustomerNew = {
          method_id: methodDB.id,
          customer_id: customer.data.id
        }
        this.mcCaseUse.createMethod(methodCustomerNew);
      }
      return { ...customer };
    }

    return validationIdMethos;
  }
  //elimina un customer
  async deleteCustomerById(customerId: number) {
    const response = await this.customerRepository.deleteCustomerById(customerId);
    if (response["affected"] === 0) {
      return { ok: false, status: 404, message: "Esta empresa no existe en la aplicación" };
    }
    return { ok: true, status: 200, message: "Empresa eliminada con exito" };
  }
  //desactiva un customer
  async deleteCustomer(cusstomerId: number) {
    const infoCustomerDeleted = await this.customerRepository.deleteCustomer(cusstomerId);
    if (infoCustomerDeleted["affected"] === 0) return null;
    return infoCustomerDeleted;
  }
  //obtiene todos los customer
  async getAllCustomers() {
    const customers = this.customerRepository.getAllCustomers();
    return await customers;
  }
  //obtiene un customer
  async getCustomerById(customerId: number) {
    const custumerFound = this.customerRepository.getCustomerById(customerId);
    if (!custumerFound) return null;
    return custumerFound;
  }
  //actualiza un customer
  async upadateCustomer(custumerId: number, newData: UpdateCustomersData) {
    const customerFound = await this.customerRepository.getCustomerById(custumerId);
    if (!customerFound) {
      return { ok: false, status: 404, message: "Empresa no existente en la aplicación" };
    }
    const keysObjects = Object.keys(newData).filter((key) => key !== "methods");
    if (keysObjects.length === 0) {
      return { ok: false, status: 204, message: "Si vas a editar esta empresa por favor llene el dato a editar" };
    }
    for (let i = 0; i < keysObjects.length; i++) {
      const element = keysObjects[i];
      newData[element] = newData[element].trim();
    }
    const listCustomerWithoutCurrent = (await this.getAllCustomers()).filter((customer) => customer.id != custumerId);
    if (listCustomerWithoutCurrent.length > 0) {
      if (newData.nit) {
        const customerFoundByNit = listCustomerWithoutCurrent.find((customer) => customer.nit === newData.nit);
        if (customerFoundByNit) {
          return {
            ok: false,
            status: 204,
            message: "No se pudo editar la empresa con este NIT",
            error: { message: "Este nit ya existe" }
          }
        }
      }
      if (newData.email) {
        const customerFoundByEmail = listCustomerWithoutCurrent.find((customer) => customer.email === newData.email);
        if (customerFoundByEmail) {
          return {
            ok: false,
            status: 204,
            message: "No se pudo editar la empresa con este correo electrónico, por favor ingrese un correo electrónico diferente",
            error: { message: "Este email (correo) ya existe" }
          }
        }
      }
    }
    if (newData.methods) {
      const listIdMethods = newData.methods;
      //array donde se almacenaran los valores unicos del array listIdMethods (id no repetidos)
      let uniques = [];
      //algoritmo para sacar los id unicos del array listIdMethods
      for (let i = 0; i < listIdMethods.length; i++) {
        const element = listIdMethods[i];
        if (!uniques.includes(listIdMethods[i])) {
          uniques.push(element);
        }
      }

      const validationIdMethos = await this.methodCaseUse.validateMethods(uniques);
      if (validationIdMethos.ok === true) {
        await this.mcCaseUse.deleteAllMCs(custumerId);

        for (let i = 0; i < uniques.length; i++) {
          const methodId = uniques[i];
          const methodDB = await this.methodCaseUse.getMethod(methodId);
          const methodCustomerNew = {
            method_id: methodDB.id,
            customer_id: custumerId
          }
          this.mcCaseUse.createMethod(methodCustomerNew);
        }

      } else if (validationIdMethos.ok === false) {
        return { ok: false, status: 203, message: "Por favor seleccione los metodos de autenticación correctamente" };
      }
    }
    delete newData.methods;
    const token = sign(
      {
        data: { ...customerFound }
      }
      , process.env.SECRET_KEY, { algorithm: "HS256" });

    if (Object.keys(newData).length === 0) {
      return { ok: true, status: 200, message: "Empresa editada con éxito", datos: token };
    }
    const custumerUpdated = await this.customerRepository.updateCustomer(custumerId, newData);
    if (custumerUpdated.ok === true) {
      return {
        message: custumerUpdated.message, ok: true, data: custumerUpdated.data
      }
    }
    return {
      message: custumerUpdated.message, ok: false
    }
  }
}