import { InterfaceCustomersRepository } from "../../customers/dominio/repository/customers.repository";
import { contractsModuloRepository } from "../dominio/repository/contracts_modulo.repository";
import { moduloRepository } from "../dominio/repository/modulo.repository";
import { ContractsModuloData, ExtendDateContractData, UpdateContractModuloData } from "../dominio/valueObject/contracts_modulo.value";
import { ModuloData, UpdateModuloData } from "../dominio/valueObject/modulo.value";

export class ModuloCaseUse {
  constructor(
    private readonly moduloRepository: moduloRepository,
    private readonly contractsRepository: contractsModuloRepository,
    private readonly customerRepository: InterfaceCustomersRepository) {
  }

  //CONTRATOS DE MODULOS
  // async updateContractModuloById(idContractModulo: number, newData: UpdateContractModuloData) {
  //   const contractFound=await this.contractsRepository.getOneContractModuloById(idContractModulo);
  //   if(!contractFound){
  //     return {ok:false,status:404,message:"El contrato que desea editar no existe en la aplicación"};
  //   }
  //   if (newData.id_customer) {
  //     const customerFound = await this.customerRepository.getCustomerById(newData.id_customer);
  //     if (!customerFound) {
  //       return { ok: false, status: 404, message: "El cliente que desea establecer en el contrato no existe en la aplicación" };
  //     } else if (customerFound.status === 0) {
  //       return { ok: false, status: 204, message: "El cliente que desea establecer en el contrato está actualmente deshabilitado en la aplicación" };
  //     }
  //   }
  //   if (newData.id_modulo) {
  //     const moduloFound = await this.moduloRepository.getOneModuloById(newData.id_modulo);
  //     if (!moduloFound) {
  //       return { ok: false, status: 404, message: "El producto que desea establecer en el contrato no existe en la aplicación" };
  //     } else if (moduloFound.status === 0) {
  //       return { ok: false, status: 204, message: "El producto que desea establecer en el contrato actualmente está deshabilitado en la aplicación" };
  //     }
  //   }

  //   const contractUpdated = await this.contractsRepository.updateContractModuloById(idContractModulo, newData);
  //   if (!contractUpdated) {
  //     return { ok: false, status: 204, message: "No se pudo editar el contrato" };
  //   }
  //   return { ok: true, status: 200, message: "Contrato editado con éxito", datos: { ...contractUpdated } };
  // }

  async saveChangesContractModulo(contractModulo: ContractsModuloData) {
    return await this.contractsRepository.saveChangesContractModulo(contractModulo);
  }

  async deleteAllContractsModulo() {
    const responseDeletedAll = await this.contractsRepository.deleteAllContractsModulo();
    if (responseDeletedAll === 0) {
      return { ok: false, status: 204, message: "No se pudo eliminar ningún contrato establecido" };
    }
    return { ok: true, status: 200, message: "Todos los contractos establecidos se eliminaron con éxito" };
  }

  async deleteAllContractsModuloAccordingStatus(idCustomer: number, status: number) {
    if (status < 0 || status > 1) {
      return { ok: false, status: 204, message: "Valor de estado (status) no valido, 1 activos y 0 inactivos" };
    }
    const responseDeleted = await this.contractsRepository.deleteAllContractsModuloAccordingStatus(idCustomer, status);
    if (responseDeleted["affected"] === 0) {
      return { ok: false, status: 404, message: `No existen contratos ${status === 1 ? "establecidos" : "deshabilitados"}` };
    }
    return { ok: true, status: 200, message: `Todos los contratos ${status === 1 ? "establecidos" : "deshabilitados"} eliminados con éxito` };
  }

  async deleteAllContractsModuloByIdModulo(idModulo: number) {
    const responseDeleted = await this.contractsRepository.deleteAllContractsModuloByIdModulo(idModulo);
    if (responseDeleted["affected"] === 0) {
      return { ok: false, status: 204, message: "No se han establecido contratos con este producto" };
    }
    return { ok: true, status: 200, message: "Todos los contratos establecido con este producto fueron eliminados con éxito" };
  }

  async deleteAllContractsModuloByIdCustomer(idCustomer: number) {
    const responseDelete = await this.contractsRepository.deleteAllContractsModuloByIdCustomer(idCustomer);
    if (responseDelete["affected"] === 0) {
      return { ok: false, status: 204, message: "No existen contratos con esta empresa" };
    }
    return { ok: true, status: 200, message: "Todos los contratos establecidos con esta empresa fueron eliminados con éxito" };
  }

  async deleteContractsModuloById(idContractModulo: number) {
    const responseDelete = await this.contractsRepository.deleteContractsModuloById(idContractModulo);
    if (responseDelete["affected"] === 0) {
      return { ok: false, status: 404, message: "Contrato no existente" };
    }
    return { ok: true, status: 200, message: "Contrato eliminado con éxito" };
  }

  async extendDateExpirationContractById(idContractModulo: number, body: ExtendDateContractData) {
    const contractFound = await this.contractsRepository.getOneContractModuloById(idContractModulo);
    if (!contractFound) {
      return { ok: false, status: 404, message: "Contrato no existente" };
    }
    const responseExtendedDate = await this.contractsRepository.extendDateExpirationContractById(idContractModulo, body);
    if (!responseExtendedDate) {
      return { ok: false, status: 404, message: "No se pudo extender la fecha de expiración del contrato" };
    }
    return { ok: true, status: 200, message: "Fecha de expiración del contrato extendida con éxito", datos: { ...responseExtendedDate } };
  }

  async getAllContractsModuloFinalized() {
    const listContractsFinalized = await this.contractsRepository.getAllContractsModuloFinalized();
    if (listContractsFinalized.length === 0) {
      return { ok: false, status: 404, message: "No se encontraron contratos finalizados" };
    }
    return { ok: true, status: 200, message: "Lista de contratos finalizados", datos: [...listContractsFinalized] };
  }

  async getAllContractsModuloByIdModulo(idModulo: number) {
    const listModulosFound = await this.contractsRepository.getAllContractsModuloByIdModulo(idModulo);
    if (listModulosFound.length === 0) {
      return { ok: false, status: 204, message: "No se encontraron contratos con este producto" };
    }
    return { ok: true, status: 200, message: "Contratos encontrados con este producto", datos: [...listModulosFound] };

  }

  async getAllContractsModuloByIdCustomer(idCustomer: number) {
    const listContractsCustomer = await this.contractsRepository.getAllContractsModuloByIdCustomer(idCustomer);
    if (listContractsCustomer.length === 0) {
      return { ok: false, status: 204, message: "Empresa sin contratos con productos de la aplicación" };
    }
    return { ok: true, status: 200, message: "Lista de contratos de esta empresa", datos: [...listContractsCustomer] };
  }

  async getOneContractModuloById(idContractModulo: number) {
    const contractModuloFound = await this.contractsRepository.getOneContractModuloById(idContractModulo);
    if (!contractModuloFound) {
      return { ok: false, status: 404, message: "Contrato no existente" };
    }
    return { ok: true, status: 200, message: "Contrato encontrado", datos: { ...contractModuloFound } };
  }

  async getAllContractsModulo() {
    const listContracts = await this.contractsRepository.getAllContractsModulo();
    if (listContracts.length === 0) {
      return { ok: false, status: 204, message: "No se encontraron contratos" };
    }
    return { ok: true, status: 200, message: "Contratos registrados", datos: [...listContracts] };
  }

  setValidityString(dateCreated: Date, dateExpired: Date): string {
    let numberMonthCreated = dateCreated.getMonth();
    let numberMonthExpired = dateExpired.getMonth() - 1;
    let validity = 0;
    if (numberMonthCreated < numberMonthExpired) {
      for (let i = numberMonthCreated; i < numberMonthExpired; i++) {
        if (validity === numberMonthExpired) {
          break;
        }
        validity++;
      }
    } else if (numberMonthCreated > numberMonthExpired) {
      for (let i = numberMonthCreated; i > numberMonthExpired; i--) {
        if (validity === numberMonthExpired) {
          break;
        }
        validity++;
      }
    }
    let daysMonthExpiration = new Date(dateExpired.getFullYear(), dateExpired.getMonth() + 1, 0).getDate();
    let dayMonthCreated = dateCreated.getDate();
    let daysPeriod = daysMonthExpiration - dayMonthCreated;
    let strValidity = `${validity} meses de vijencia con ${daysPeriod}`;
    return strValidity;
  }

  validateDateExpirationContractModulo(dateCreated: Date, dateExpired: Date): number {
    if (dateExpired.getFullYear() < dateCreated.getFullYear()) {
      return 1;
    }
    return 0;
  }

  async createContractModulo(body: ContractsModuloData) {
    const customerFound = await this.customerRepository.getCustomerById(body.id_customer);
    if (!customerFound) {
      return { ok: false, status: 404, message: "Empresa no existente" };
    } else if (customerFound.status === 0) {
      return { ok: false, status: 203, message: "Empresa actualmente deshabilitado en la aplicación" };
    }
    const moduloFound = await this.moduloRepository.getOneModuloById(body.id_modulo);
    if (!moduloFound) {
      return { ok: false, status: 404, message: "Producto no existente" };
    } else if (moduloFound.status === 0) {
      return { ok: false, status: 203, message: "Producto actualmente deshabilitado en la aplicación" };
    }

    const contractFound = await this.contractsRepository.getContractByIdCustomerByIdModulo(body.id_customer, body.id_modulo);
    if (!contractFound) {
      const contractModuloCreated = await this.contractsRepository.createContractModulo(body);
      if (!contractModuloCreated) {
        return { ok: false, status: 204, message: "Contracto con el producto no agregado" };
      }
      let monthCreated = contractModuloCreated.date_contract;
      let monthExpired = contractModuloCreated.date_expiration;

      const contract = await this.contractsRepository.changeValidityContractModuloById(contractModuloCreated.id, this.setValidityString(monthCreated, monthExpired));
      return { ok: true, status: 200, message: "Su contrato con el producto fue establecido con éxito", datos: { ...contract } };
    }
    return { ok: false, status: 200, message: "Ya tienes un contrato con este producto" };
  }


  //MODULOS O PRODUCTOS
  async saveChangesModulo(modulo: ModuloData) {
    return await this.moduloRepository.saveChangesModulo(modulo);
  }

  async enableModuloById(idModulo: number) {
    const responseEnableModulo = await this.moduloRepository.enableModuloById(idModulo);
    if (responseEnableModulo["affected"] === 0) {
      return { ok: false, status: 404, message: "Producto no encontrado" };
    }
    const moduloFound = await this.moduloRepository.getOneModuloById(idModulo);
    return { ok: true, status: 200, message: "Producto activado con éxito", datos: { ...moduloFound } };
  }

  async enableAllModulo(): Promise<any> {
    const listModulos = await this.moduloRepository.getAllModulo();
    if (listModulos.length === 0) {
      return { ok: false, status: 204, message: "No hay productos en la aplicación" };
    }
    const responseDeletedAllModulo = await this.moduloRepository.enableAllModulo();
    if (responseDeletedAllModulo === 0) {
      return { ok: false, status: 203, message: "No se pudo activar ningún producto" };
    }
    const listModulosFound = await this.moduloRepository.getAllModulo();
    return { ok: true, status: 200, message: "Productos de la aplicación activados con éxito", datos: [...listModulosFound] };
  }

  async deleteAllModuloAccordingStatus(status: number) {
    if (status < 0 || status > 1) {
      return { ok: false, status: 204, message: "Valor incorrecto del estado (status)  1 activado y 0 desactivado" };
    }
    const responseDeleteAllModuloAccordingStatus = await this.moduloRepository.deleteAllModuloAccordingStatus(status);
    if (responseDeleteAllModuloAccordingStatus["affected"] === 0) {
      return { ok: false, status: 204, message: `No se encontraron productos ${status === 1 ? "activos" : "inactivos"}` };
    }
    return { ok: true, status: 200, message: `Productos ${status === 1 ? "activos" : "inactivos"} eliminados con éxito` };
  }

  async updateModuloById(idModulo: number, newData: UpdateModuloData) {
    const moduloUpdated = await this.moduloRepository.updateModuloById(idModulo, newData);
    if (!moduloUpdated) {
      return { ok: false, status: 404, message: "Producto no existente" };
    }
    return { ok: true, status: 200, message: "Producto actualizado con éxito", datos: { ...moduloUpdated } };
  }

  async disableAllModulo() {
    const listModulos = await this.moduloRepository.getAllModulo();
    if (listModulos.length === 0) {
      return { ok: false, status: 204, message: "No hay productos en la aplicación" };
    }
    const responseDeletedAllModulo = await this.moduloRepository.disableAllModulo();
    if (responseDeletedAllModulo === 0) {
      return { ok: false, status: 203, message: "No se pudo desactivar ningún producto" };
    }
    const listModulosFound = await this.moduloRepository.getAllModulo();
    return { ok: true, status: 200, message: "Productos de la aplicación desactivados con éxito", datos: [...listModulosFound] };
  }

  async disableModuloById(idModulo: number) {
    const moduloUpdated = await this.moduloRepository.disableModuloById(idModulo);
    if (!moduloUpdated) {
      return { ok: false, status: 404, message: "Producto no existente" };
    }
    if (moduloUpdated.status === 0) {
      return { ok: true, status: 200, message: "Producto desactivado con éxito", datos: { ...moduloUpdated } };
    }
    return { ok: false, status: 204, message: "No se pudo desactivar este producto" };
  }

  async deleteAllModulo() {
    const listModulos = await this.moduloRepository.getAllModulo();
    if (listModulos.length === 0) {
      return { ok: false, status: 204, message: "No hay productos en la aplicación" };
    }
    const responseDeletedAllModulo = await this.moduloRepository.deleteAllModulo();
    if (responseDeletedAllModulo === 0) {
      return { ok: false, status: 203, message: "No se pudo eliminar ningún producto" };
    }
    return { ok: true, status: 200, message: "Productos de la aplicación eliminados con éxito" };
  }

  async deleteModuloById(idModulo: number) {
    const responseDeletedModulo = await this.moduloRepository.deleteModuloById(idModulo);
    if (responseDeletedModulo["affected"] === 0) {
      return { ok: false, status: 204, message: "Producto no existente" };
    }
    return { ok: true, status: 200, message: "Producto eliminado con éxito" };
  }


  async getAllModuloAccordingStatus(status: number) {
    if (status < 0 || status > 1) {
      return { ok: false, status: 204, message: "Valor incorrecto del estado (status)  1 activado y 0 desactivado" };
    }
    const listModulos = await this.moduloRepository.getAllModuloAccordingStatus(status);
    if (listModulos.length === 0) {
      return { ok: false, status: 404, message: `No existenten productos ${status === 1 ? "activos" : "inactivos"}`, error: { message: `No existente productos ${status === 1 ? "activos" : "inactivos"}` } };
    }
    return { ok: true, status: 200, message: `Lista de productos ${status === 1 ? "activos" : "inactivos"}`, datos: [...listModulos] };
  }

  async getOneModuloById(idModulo: number) {
    const moduloFound = await this.moduloRepository.getOneModuloById(idModulo);
    if (!moduloFound) {
      return { ok: false, status: 404, message: "Producto no encontrado", error: { message: "Este modulo (producto) no existe en la aplicación" } };
    }
    return { ok: true, status: 200, message: "Modulo (producto) encontrado", datos: { ...moduloFound } };
  }

  async getAllModulo() {
    const listModulos = await this.moduloRepository.getAllModulo();
    if (listModulos.length === 0) {
      return { ok: false, status: 204, mesage: "Actulmente no hay productos agregados" };
    }
    return { ok: true, status: 200, message: "Lista de productos agregados", datos: [...listModulos] };
  }

  async createModulo(body: ModuloData) {
    const moduloCreated = await this.moduloRepository.createModulo(body);
    if (!moduloCreated) {
      return { ok: false, status: 204, message: "No se pudo agregar el producto", error: { message: "Se produjo un error al crear el modulo en la aplicación" } };
    }
    return { ok: true, status: 200, message: "Producto creado con éxito", datos: { ...moduloCreated } };
  }
}