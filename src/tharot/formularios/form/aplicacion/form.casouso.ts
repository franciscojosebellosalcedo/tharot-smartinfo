import { FormData, UpdateForm } from '../dominio/valueobject/form.value';
import { CampoData, UpdateCampo } from '../dominio/valueobject/campo.value';
import { formRepository } from '../dominio/repository/form.repository';
import { campoRepository } from '../dominio/repository/campo.repository';
import { EntityCasoUSo } from '../../../sql/aplicasion/query.casouso';
import { EntityRepo } from '../../../sql/dominio/repository/query.repository';
import { InterfaceSubMenuRepository } from '../../../principal/menu/dominio/repository/sub.menu.repository';
import { InterfaceMenuRepository } from '../../../principal/menu/dominio/repository/menu.repository';
import { subMenuData } from '../../../principal/menu/dominio/valueobject/sub.menu.value';
import { RolRepository } from '../../../principal/rol/dominio/repository/rol.respository';
import { RolData } from '../../../principal/rol/dominio/valueobject/rol.value';
import { InterfaceMenuRolRepository } from '../../../principal/menu_rol/dominio/repository/menu_rol.repository';
import { InterfaceCustomersRepository } from '../../../principal/customers/dominio/repository/customers.repository';
import { actionsRepository } from '../../../principal/menu/dominio/repository/actions.repository';
export class FormCasoUso {
  private readonly entityCaso: EntityCasoUSo;
  constructor(
    private readonly FormRepo: formRepository,
    private readonly campoRepo: campoRepository,
    private sqlRepository?: EntityRepo,
    private menuRepository?: InterfaceMenuRepository,
    private subMenuRepository?: InterfaceSubMenuRepository,
    private rolRepository?: RolRepository,
    private menuRolRepository?: InterfaceMenuRolRepository,
    private customerRepository?: InterfaceCustomersRepository,
    private actionRepository?: actionsRepository
  ) {
    this.entityCaso = new EntityCasoUSo(this.sqlRepository);
  }

  //METODOS DATOS DE LA TABLA DEL FORMULARIO

  async getOneRegisterTableByIdFormByIdRegister(idForm: number, idRegister: number): Promise<any> {
    const formFound = await this.FormRepo.getForm(idForm);
    if (!formFound) {
      return { ok: false, status: 404, message: "Formulario de este registro no encontrado", error: { message: "No se encontró el formulario en la base de datos" } };
    }
    return await this.entityCaso.getOneRegisterTableByNameById(idRegister, formFound.table_db);

  }

  async updateRegisterTable(idRegister: number, idForm: number, data: object) {
    const formFound = await this.FormRepo.getForm(idForm);
    if (!formFound) {
      return {
        ok: false,
        message: "No es posible editar este registro",
        status: 204,
        error: { message: "El formulario no existe en la base de datos" }
      }
    }
    const res = await this.entityCaso.updateRegisterTableByNameById(idRegister, formFound.table_db, data);
    return {
      ok: true,
      message: "Datos registrados correctamente.",
      status: 200,
      datos: { ...res }
    }
  }


  async enabledRegisterTableByNameById(idRegister: number, idForm: number) {
    const formFound = await this.FormRepo.getForm(idForm);
    if (!formFound) {
      return {
        ok: false,
        message: "No es posible eliminar este registro",
        status: 204,
        error: { message: "El formulario no existe en la base de datos" }
      }
    }
    return this.entityCaso.enabledRegisterTableByNameById(idRegister, formFound.table_db);
  }
  async deleteRegisterTableByNameById(idRegister: number, idForm: number) {
    const formFound = await this.FormRepo.getForm(idForm);
    if (!formFound) {
      return {
        ok: false,
        message: "No es posible eliminar este registro",
        status: 204,
        error: { message: "El formulario no existe en la base de datos" }
      }
    }
    return this.entityCaso.deleteRegisterTableByNameById(idRegister, formFound.table_db);
  }

  async insertData(formId: number, data: object) {
    const keys = Object.keys(data);
    const formFound = await this.FormRepo.getForm(formId);
    if (!formFound) {
      return { ok: false, message: "Asegurese de crear primero un formulario para poder guardar registros", status: 404, error: { message: "No existe formulario con el id enviado" } }
    }
    const fieldsByIdForm = await this.campoRepo.getAllCampoByIdForm(formId);
    if (fieldsByIdForm.length === 0) {
      return {
        ok: false, status: 204, message: "Este formulario no tiene campos asignados", error: { message: "Formulario sin campos registrados en la base de datos" }
      }
    }
    if (keys.length === 0) {
      return {
        ok: false, status: 204, message: "Asegurese de enviar todos los datos", error: { message: "No esta llegando datos para almacenar en la tabla " }
      }
    }
    if (keys.length != fieldsByIdForm.length) {
      return {
        ok: false, status: 204, message: "Por favor asegurese de enviar todos los datos"
      }
    }
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (data[key] === null || data[key] === undefined || data[key] === "" || data[key] === '') {
        return { ok: false, status: 204, message: "Por favor llene todos los campos", error: { message: "Algunos campos del formulario no estan llenos" } }
      }
    }
    const form = await this.getForm(formId);
    if (!form) {
      return {
        ok: false, message: "Formulario no encontrado", status: 404, error: { message: "Este formulario no existe en la base de datos" }
      }
    }
    const result = await this.entityCaso.insertDataTable(form, data);
    return result;
  }

  async getAllDataTableByIdForm(formId: number) {
    const form = await this.getForm(formId);
    if (!form) {
      return {
        msg: "Formulario no encontrado", ok: false
      }
    }
    const allDataTable = await this.entityCaso.getAllDataTableByIdForm(form);
    return allDataTable;
  }


  //METODOS CAMPOS


  async getFormByName(tableDb: string): Promise<FormData> {
    return await this.FormRepo.getFormByName(tableDb);
  }

  async validateNameTable(nameTable: string) {
    return this.FormRepo.validateNameTable(nameTable);
  }

  async getAllCampoByIdForm(form_id: number): Promise<CampoData[]> {
    return await this.campoRepo.getAllCampoByIdForm(form_id);
  }

  async disabledFormById(id: number): Promise<FormData | null> {
    return await this.FormRepo.disabledFormById(id);
  }

  async enabledFormById(form_id: number): Promise<FormData | null> {
    return await this.FormRepo.enabledFormById(form_id);
  }

  async registrar(form: FormData, campos: CampoData[]) {
    const customerFound = await this.customerRepository.getCustomerById(form.customer_id);
    if (!customerFound) {
      return { ok: false, msg: "Empresa no existente" };
    } else if (customerFound.status === 0) {
      return { ok: false, msg: "Empresa actualmente deshabilitada en la aplicación" };
    }
    
    for (let i = 0; i < campos.length; i++) {
      for (let j = i + 1; j < campos.length; j++) {
        if (campos[i]["label"].trim().toLowerCase() === campos[j]["label"].trim().toLowerCase()) {
          return { ok: false, status: 204, message: `El label '${campos[i].label}' está duplicado, por favor cambien el nombre de alguno de los dos label`, error: { message: "El usuario intentó agregar un nombre de label igual al de otro campo" } }
        }
      }
    }
    if (await this.FormRepo.validateNameTable(form.table_db) === true) {
      return {
        msg: "Formulario existente", ok: false
      }
    }
    const minuscula = form.table_db.toLowerCase();
    form.table_db = minuscula.replace(/\s/g, "_");
    const formBD = await this.FormRepo.createForm(form);
    await Promise.all(campos.map(async campo => {
      campo.form_id = formBD.id;
      const camp = await this.campoRepo.createCampo(campo);
      return camp;
    }));
    if (!formBD) {
      return { ok: false, msg: "No se pudo crear el formulario" };
    }
    const menuFound = await this.menuRepository.getMenuByName("Formularios");
    if (!menuFound) {
      return { ok: false, msg: "No existe un menu para los formularios" };
    }
    let listIdRols: number[] = [];
    const listRols = await this.rolRepository.getAllRols();
    if (listRols.length === 0) {
      return { ok: false, msg: "No existen rol en la aplicación" };
    }
    for (let i = 0; i < listRols.length; i++) {
      const rol: RolData = listRols[i];
      listIdRols.push(rol.id);
    }
    const data: subMenuData = {
      menu_id: menuFound.id,
      name: form.titulo,
      orden: 1,
      acciones: "handleGetForm",
      type_form: 1,
      id_form: formBD.id,
      roles: [...listIdRols]
    }
    const submenuCreated = await this.subMenuRepository.createSubMenu(data);
    for (let i = 0; i < listRols.length; i++) {
      const rol: RolData = listRols[i];
      await this.menuRolRepository.createMenuRol({ id_rol: rol.id, sub_menu_id: submenuCreated.id });
    }
    await this.actionRepository.createAction({name:"handleGetForm",description:formBD.titulo,id_form:formBD.id});
    await this.entityCaso.generateEntity(form.table_db, campos);
    return {
      msg: "Formulario creado con exito",
      form: {
        ...formBD
      },
      ok: true
    };
  }

  async getAllFormsByIdCustomer(idCustomer: number){
    const customerFound=await this.customerRepository.getCustomerById(idCustomer);
    if(!customerFound){
      return {ok:false,status:404,message:"Empresa no existente"};
    }else if(customerFound.status===0){
      return {ok:false,status:203,message:"Empresa actualmente deshabilitada en la aplicación"};
    }
    const formsByCustomer=await this.FormRepo.getAllFormsByIdCustomer(idCustomer);
    if(formsByCustomer.length===0){
      return {ok:false,status:204,message:"Esta empresa no tiene formularios registrados"};
    }
    return {ok:true,status:200,message:`Formularios creados por la empresa ${customerFound.name}`,datos:[...formsByCustomer]};
  }

  async listForm(id: number) {
    return await this.FormRepo.listForm(id);
  }

  async getForm(id: number) {
    const form = await this.FormRepo.getForm(id);
    if (!form) {
      return null;
    }
    const campos = await this.campoRepo.listCampo(form.id);
    const res = {
      ...form,
      campos
    };
    return res;
  }

  async deleteAllForms() {
    const listForms = await this.FormRepo.getAllForms();
    if (listForms.length === 0) {
      return { ok: false, status: 204, message: "No hay formularios registados en la aplicación" };
    }
    let aux = 0;
    for (let i = 0; i < listForms.length; i++) {
      const form: FormData = listForms[i];
      const response = await this.deleteFormById(form.id);
      if (response.ok === true) {
        aux++;
      }
    }
    if (aux === 0) {
      return { ok: false, status: 204, message: "No se pudo eliminar ningún formulario" };
    }
    return { ok: true, status: 200, message: "Formularios eliminados con éxito" };
  }

  async getAllFormsAccordingStatus(status: number) {
    if(status<0 || status>1){
      return {ok:false,status:204,message:"Valor no valido del filtro (status invalido) 1 activo y 0 inactivo"};
    }
    const listForms=await this.FormRepo.getAllFormsAccordingStatus(status);
    if(listForms.length===0){
      return {ok:false,status:204,message:`No hay formularios ${status===1?"activos":"inactivos"}`};
    }

    return {ok:true,status:200,message:`Formularios ${status===1?"activos":"inactivos"} encontrados`,datos:[...listForms]};
  }

  async getAllForms() {
    const listForms = await this.FormRepo.getAllForms();
    if (listForms.length === 0) {
      return { ok: false, status: 204, message: "Actualmente no hay formularios registrados en la aplicación" };
    }
    return { ok: true, status: 200, message: "Lista de formularios", datos: [...listForms] };
  }

  async deleteAllFormsAccordingStatus(status: number) {
    const response = await this.FormRepo.deleteAllFormsAccordingStatus(status);
    if (response["affected"] === 0) {
      return { ok: false, status: 204, message: `No se eliminó ningún formulario ${status === 1 ? "activo" : "inactivo"}` };
    }
    return { ok: true, status: 200, message: `Formularios ${status === 1 ? "activo" : "inactivo"} eliminados con éxito` };
  }

  async deleteFormById(idForm: number) {
    const formFound = await this.FormRepo.getForm(idForm);
    if (!formFound) {
      return { ok: false, status: 404, message: "Formulario no existente" };
    }
    const submenuFound = await this.subMenuRepository.getSubMenuByIdForm(formFound.id);
    await this.menuRolRepository.deleteAllMenuRolByIdSubMenu(submenuFound.id);
    await this.subMenuRepository.deleteSubMenuById(submenuFound.id);
    const action=await this.actionRepository.getOneActionByIdActionByIdForm(formFound.id);
    await this.actionRepository.deleteAction(action.id);
    const responseDeleted = await this.FormRepo.deleteFormById(idForm);
    if (responseDeleted["affected"] === 0) {
      return { ok: false, status: 204, message: "Formulario no existente" };
    }
    const listColumn=await this.campoRepo.getAllCampoByIdForm(formFound.id);
    for (let i = 0; i < listColumn.length; i++) {
      const campo:CampoData = listColumn[i];
      await this.campoRepo.deleteCampoById(campo.id);
    }
    return { ok: true, status: 200, message: "Formulario eliminado con éxito" };
  }

  async updateForm(id: number, data: UpdateForm) {
    return await this.FormRepo.updateForm(id, data);
  }

  async updateCampoById(idCampo: number, data: UpdateCampo) {
    try {
      const res = await this.campoRepo.updateCampoById(idCampo, data);
      if (res) {
        return {
          ok: true,
          message: "campo actualizado correctamente",
          datos: { ...res }
        }
      }
    } catch (error) {
      return {
        ok: false,
        message: "Algo salio mal al actualizar el campo.",
        error: { ...error }
      }
    }
    const res = await this.campoRepo.updateCampoById(idCampo, data);
    if (res) {
      return {
        ok: true,
        message: "campo actualizado correctamente",
        datos: { ...res }
      }
    }
  }

  async deleteCampo(id: number) {
    return this.campoRepo.deleteCampo(id);
  }

  async addCampo(data: CampoData) {
    return this.campoRepo.createCampo(data);
  }

  async getCampoByIdForm(idForm: number) {
    return await this.campoRepo.getCampoByIdForm(idForm);
  }
}