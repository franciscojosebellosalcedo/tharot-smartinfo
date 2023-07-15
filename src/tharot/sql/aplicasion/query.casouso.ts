import { CampoData } from "../../formularios/form/dominio/valueobject/campo.value";
import { EntityRepo } from "../dominio/repository/query.repository";

export class EntityCasoUSo {
  constructor(private readonly entityRepository: EntityRepo) { }

  async getOneRegisterTableByNameById(idRegister: number, nameTable: string): Promise<any> {
    const registerFound = await this.entityRepository.getOneRegisterTableByNameById(idRegister, nameTable);
    if (!registerFound[0]) {
      return { ok: false, status: 404, message: "Registro no encontrado", error: { message: "El registro seleccionado no se encuentra registrado en la base de datos" } };
    }
    return { ok: true, status: 200, message: "Registro encontrado", datos: { ...registerFound[0] } };
  }

  async getAllDataTableByIdForm(form: any): Promise<any[] | any> {
    const registers = await this.entityRepository.getAllDataTableByIdForm(form);
    if (!registers) {
      return {ok:false,message:"No hay registros guardados de este formulario",status:204,error:{message:"No registrado desde este formulario a la base de datos"}};
    }
    if (registers.length === 0) {
      return { ok: false, status: 404, message: "No se encontro ningún registro de este formulario", error: { message: "No se ha registrado ningún dato en este formulario" } };
    }
    return { ok: true, status: 200, message: "Registros encontrados", datos: [...registers] };
  }

  async updateRegisterTableByNameById(idRegister: number, nameTable: string, data: object) {
    const response = await this.entityRepository.updateRegisterTableByNameById(idRegister, nameTable, data);
    if (response.affect === 0) {
      return {
        ok: false,
        message: "No se pudo editar el registro",
        error: { message: "Este registro no se encuentra en la aplicación" },
        status: 204
      }
    }
    return {
      ok: true,
      status: 200,
      datos: { ...response.registerFound }
    }

  }

  async enabledRegisterTableByNameById(id: number, nameTable: string) {
    const result = await this.entityRepository.enabledRegisterTableByNameById(id, nameTable);
    if (result.responseDelete === 0) {
      return {
        ok: false,
        message: "Este registro no se encuentra",
        status: 204,
        error: { message: "Este registro no se encuentra en la tabla " + nameTable }
      }
    }
    return {
      ok: true,
      status: 200,
      datos: result.registerFound
    }
  }

  async deleteRegisterTableByNameById(id: number, nameTable: string) {
    const result = await this.entityRepository.deleteRegisterTableByNameById(id, nameTable);
    if (result.responseDelete === 0) {
      return {
        ok: false,
        message: "Este registro no se encuentra",
        status: 204,
        error: { message: "Este registro no se encuentra en la tabla " + nameTable }
      }
    }
    return {
      ok: true,
      status: 200,
      datos: result.registerFound
    }
  }

  async generateEntity(nameTable: string, colums: CampoData[]) {
    return await this.entityRepository.createTable(nameTable, colums);
  }

  async insertDataTable(form: any, data: object) {
    const name_bd = form.table_db;
    const dataSend = [];
    for (let i = 0; i < form.campos.length; i++) {
      const item = form.campos[i];
      const key = item.label;
      const name = item.name_bd;
      let tmp = {};
      tmp[name] = data[key];
      dataSend.push(tmp);
    }
    const res = await this.entityRepository.insertDataTable(name_bd, dataSend);
    return res;
  }
}
