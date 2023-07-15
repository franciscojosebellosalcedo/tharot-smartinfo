import { MethodRepository } from "../dominio/repository/method.respository";
import { MethodData, UpdateMethod } from "../dominio/valueobject/method.value";

export class MethodCasoUso {
  constructor(private readonly methodRepository: MethodRepository) { }

  async deleteAllMethods() {
    const methods=await this.methodRepository.getAllMethods();
    if(methods.length===0){
      return {ok:false,status:204,message:"No existen métodos registrados"};
    }
    const responseDeleted=await this.methodRepository.deleteAllMethods();
    if(responseDeleted===0){
      return {ok:false,status:204,message:"No existen métodos registrados"};
    }
    return {ok:true,status:200,message:"Métodos de autenticación eliminados con éxito"};
  }

  async disableAllMethods() {
    const listMethods = await this.methodRepository.getAllMethods();
    if (listMethods.length === 0) {
      return { ok: false, status: 204, message: "No existen registros" };
    }
    let aux: number = 0;
    for (let i = 0; i < listMethods.length; i++) {
      const method: MethodData = listMethods[i];
      if (method.status === 0) {
        aux++;
      }
    }
    if (aux === listMethods.length) {
      return { ok: false, status: 200, message: "Todos los métodos de autenticación actualmente ya estan desactivados" };
    }
    const responseDisabledAllMethods = await this.methodRepository.disableAllMethods();
    if (responseDisabledAllMethods === 0) {
      return { ok: false, status: 203, message: "No se pudo desactivar ningún método de autenticación" };
    }
    return { ok: true, status: 200, message: "Métodos de autenticación desactivados con éxito" };
  }

  async disableMethodById(idMethod: number) {
    const methodFound = await this.methodRepository.getMethod(idMethod);
    if (!methodFound) {
      return { ok: false, status: 404, message: "Método de autenticación no existente" };
    } else if (methodFound.status === 0) {
      return { ok: false, status: 200, message: "Método de autenticación actualmente inactivo" };
    }
    const methodDisabled = await this.methodRepository.disableMethodById(idMethod);
    if (methodDisabled.status === 1) {
      return { ok: false, status: 200, message: "No se pudo desactivar el método de autenticación" };
    }
    return { ok: true, status: 200, message: "Método de autenticación desactivado con éxito" };
  }

  async deleteMethodById(idMethod: number) {
    const response = await this.methodRepository.deleteMethodById(idMethod);
    if (response["affected"] === 0) {
      return { ok: false, status: 204, message: "Método no existente" };
    }
    return { ok: true, status: 200, message: "Método de autenticación eliminado con éxito" };
  }

  async deleteAllMetthosAccordingStatus(status: number) {
    if (status < 0 || status > 1) {
      return { ok: false, status: 203, message: "Valor de status no valida (0 inactivo y 1 activo )" };
    }
    const response = await this.methodRepository.deleteAllMetthosAccordingStatus(status);
    if (response["affected"] === 0) {
      return { ok: false, status: 204, message: "No se encontraron métodos de autenticación" };
    }
    return { ok: true, status: 200, message: "Métodos de autenticación eliminados con éxito" };
  }

  async getAllMethodsAccordingStatus(status: number) {
    if (status < 0 || status > 1) {
      return { ok: false, status: 203, message: "Valor de status no valida (0 inactivo y 1 activo )" };
    }
    const listMethods = await this.methodRepository.getAllMethodsAccordingStatus(status);
    return { ok: true, status: 200, message: "Métodos de autenticación encontrados", datos: [...listMethods] };
  }

  async getMethod(id: number) {
    const method = await this.methodRepository.getMethod(id);
    return method;
  }
  async validateMethods(listIdMethods: number[]) {
    return await this.methodRepository.validateMethods(listIdMethods);
  }
  async getAllMethods() {
    const methods = await this.methodRepository.getAllMethods();
    return methods;
  }

  async createMethod(data: MethodData) {
    data.name = data.name.trim();
    const method = await this.methodRepository.createMethod(data);
    if (!method) {
      return {
        ok: false,
        message: "Este método de autenticación ya existe",
        status: 204,
        error: { message: "Este método de autenticación ya existe en la base de datos" }
      }
    }
    return method;
  }

  async updateMethod(id: number, data: UpdateMethod) {
    if (data.name) {
      const keysObject = Object.keys(data);
      for (let i = 0; i < keysObject.length; i++) {
        const element = keysObject[i];
        data[element] = data[element].trim();
      }
      data.name = data.name.toLowerCase();
    }
    const listMethodWithoutCurrent = await (await this.getAllMethods()).filter((method) => method.id != id);
    if (listMethodWithoutCurrent.length > 0) {
      const methodFound = listMethodWithoutCurrent.find((method) => method.name === data.name);
      if (methodFound) {
        return {
          ok: false,
          message: "No se pudo editar el método de autenticación con el nombre ingresado.",
          status: 204,
          error: {
            message: "Ya existe un método de autenticación con este nombre en la base de datos"
          }
        }
      }
    }
    const method = await this.methodRepository.updateMethod(id, data);
    return method;
  }

  async deleteMethod(id: number) {
    return await this.methodRepository.deleteMethod(id);
  }

  async enableMethod(id: number) {
    return this.methodRepository.enableMethod(id);
  }
}
