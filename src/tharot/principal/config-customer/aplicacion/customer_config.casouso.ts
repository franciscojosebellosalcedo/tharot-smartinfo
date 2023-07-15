import { InterfaceCustomersRepository } from "../../customers/dominio/repository/customers.repository";
import { ConfigCustomerRepository } from "../dominio/repository/config_custom.repository";
import { ConfigCustomerData, UpdateConfigCustomer } from "../dominio/valueobjects/config_custom.value";

export class ConfigCustomerCasoUso {
  constructor(private readonly configCustomerRepository: ConfigCustomerRepository, private readonly customerRepository?: InterfaceCustomersRepository) { }

  async enableAllConfigCustomer(): Promise<any> {
    const listConfigsCustomers=await this.configCustomerRepository.getAllConfigCustomer();
    let aux=0;
    for (let i = 0; i < listConfigsCustomers.length; i++) {
      const config:ConfigCustomerData = listConfigsCustomers[i];
      if(config.status===1){
        aux++;
      }
    }
    if(aux===listConfigsCustomers.length){
      return {ok:false,status:204,message:"Todas las personalizaciones actualmente están activas"};
    }
    const responseEnabledConfigCustomer=await this.configCustomerRepository.enableAllConfigCustomer();
    if(responseEnabledConfigCustomer===0){
      return {ok:false,status:204,message:"No se pudo activar ninguna personalización"};
    }
    return {ok:true,status:200,message:"Personalizaciones activadas con éxito"};
  }

  async enableOneConfigCustomerById(idConfigCustomer: number) {
    const configCustomerFound=await this.configCustomerRepository.getConfigCustomer(idConfigCustomer);
    if(!configCustomerFound){
      return {ok:false,status:404,message:"Personalización no existente en la aplicación"};
    }else if(configCustomerFound.status===1){
      return {ok:false,status:204,message:"Personalización actualmente activa en la aplicación"};
    }
    const response=await this.configCustomerRepository.enableOneConfigCustomerById(idConfigCustomer);
    if(response.status===0){
      return {ok:false,status:204,message:"No se pudo activar la personalización"};
    }
    return {ok:true,status:200,message:"Personalización activada con éxito",datos:{...response}};
  }

  async deleteAllConfigsCustomers(): Promise<any> {
    const listConfigsCustomers=await this.configCustomerRepository.getAllConfigCustomer();
    if(listConfigsCustomers.length===0){
      return {ok:false,status:204,message:"No existen personalizaciones"};
    }
    const responseDeletedAllConfigs=await this.configCustomerRepository.deleteAllConfigsCustomers();
    if(responseDeletedAllConfigs===0){
      return {ok:false,status:204,message:"No se pudo eliminar ninguna personalizacion establecida por las empresas"};
    }
    return {ok:false,status:204,message:"Todas las personalizaciones establecidas por las empresas se eliminaron con éxito"};
  }

  async disableAllConfigsCustomers() {
    const listConfigsCustomers=await this.configCustomerRepository.getAllConfigCustomer();
    let aux=0;
    if(listConfigsCustomers.length===0){
      return {ok:false,status:204,message:"No existen personalizaciones"};
    }
    for (let i = 0; i < listConfigsCustomers.length; i++) {
      const config:ConfigCustomerData = listConfigsCustomers[i];
      if(config.status===0){
        aux++;
      }
    }
    if(aux===listConfigsCustomers.length){
      return {ok:false,status:200,message:"Las configuraciones establecidas por las empresas ya están desactivadas"};
    }
    const responseDisabledAllConfig=await this.configCustomerRepository.disableAllConfigsCustomers();
    if(responseDisabledAllConfig===0){
      return {ok:false,status:203,message:"No se pudo desactivar ninguna personalización"};
    }
    return {ok:true,status:200,message:"Todas las personalizaciones establecidas por las empresas fueron desactivadas con éxito"};
    
  }

  async deleteAllConfigsCustomersAccordingStatus(status: number) {
    if(status<0 || status>1){
      return {ok:false,status:203,message:"Valor de status no valido (1 activo y 0 inactivos) "};
    }
    const listConfigsCustomers = await this.configCustomerRepository.getAllConfigCustomer();
    if(listConfigsCustomers.length===0){
      return {ok:false,status:204,message:"No hay personalizaciones registradas en la aplicación"};
    }
    const responseDeletedAll=await this.configCustomerRepository.deleteAllConfigsCustomersAccordingStatus(status);
    if(responseDeletedAll["affected"]===0){
      return {ok:false,status:204,message:"No hay personalizaciones registradas en la aplicación"};
    }
    return {ok:true,status:200,message:"Personalizaciones eliminas con éxito"};

  }

  async disableOneConfigCustomer(idConfigCustomer: number) {
    const configCustomerDisabled = await this.configCustomerRepository.disableOneConfigCustomer(idConfigCustomer);
    if (!configCustomerDisabled) {
      return { ok: false, status: 404, message: "Personalización no existente" };
    }
    if (configCustomerDisabled.status === 1) {
      return { ok: false, status: 204, message: "No se pudo deshabilitar la personalización" };
    }
    return {ok:true,status:200,message:"Personalización deshabilitada con exito"};
  }

  async deletePermanentConfigCustomer(idConfigCustomer: number) {
    const responseDeleted = await this.configCustomerRepository.deletePermanentConfigCustomer(idConfigCustomer);
    if (responseDeleted["affected"] === 0) {
      return { ok: false, status: 204, message: "No se encontró ninguna personalización" };
    }
    return { ok: true, status: 200, message: "Personalización eliminada con exito" };
  }

  async getAllConfigCustomer() {
    const configsCustomers = await this.configCustomerRepository.getAllConfigCustomer();
    if (configsCustomers.length === 0) {
      return { ok: false, status: 204, message: "No se encontraron personalizaciones registras en la aplicación" };
    }
    return { ok: true, status: 200, message: "Personalizaciones registras en la aplicación", datos: [...configsCustomers] };
  }

  async getConfigCustomer(idCustomer: number) {
    const customerFound = await this.customerRepository.getCustomerById(idCustomer);
    if (!customerFound) {
      return { ok: false, message: "Empresa no exitente", status: 404 };
    }
    const configFound = await this.configCustomerRepository.getConfigCustomer(idCustomer);
    if (!configFound) {
      return { ok: false, status: 404, message: "Esta empresa no tiene una personalización establecida en la aplicación" }
    }
    return { ok: true, status: 200, message: "Personalización encontrada", datos: { ...configFound } };
  }

  async createConfigCustomer(data: ConfigCustomerData) {
    const customerFound = await this.customerRepository.getCustomerById(data.customer_id);
    if (!customerFound) {
      return { ok: false, message: "Empresa no exitente", status: 404 };
    }
    // const img = Buffer.from(data.icon_menu, 'base64');
    // const {icon_menu, ...res} = data
    // const dataSend : ConfigCustomerDb = {icon_menu:img, ...res};
    const changesAplication = await this.configCustomerRepository.createConfigCustomer(data);
    return changesAplication;

  }

  async updateConfigCustomer(idCustomer: number, payload: UpdateConfigCustomer) {
    const customerFound = await this.customerRepository.getCustomerById(idCustomer);
    if (!customerFound) {
      return { ok: false, message: "Empresa no exitente", status: 404 };
    }
    const { configUpdated, configCustomerUpdated } = await this.configCustomerRepository.updateConfigCustomer(idCustomer, payload);
    if (configUpdated["affected"] === 0) {
      return {
        ok: false,
        status: 204,
        message: "No se pudo actualizar la configuración",
        error: { message: "No se edito en la base de datos del configuración" }
      }
    }
    return {
      ok: true,
      status: 200,
      message: "Configuración actualizada con exito",
      datos: { ...configCustomerUpdated }
    }
  }

  async deleteConfigCustomer(idCustomer: number) {
    const customerFound = await this.customerRepository.getCustomerById(idCustomer);
    if (!customerFound) {
      return { ok: false, message: "Empresa no exitente", status: 404 };
    }
    const payload = { status: 0 };
    const { configUpdated, configCustomerUpdated } = await this.configCustomerRepository.updateConfigCustomer(idCustomer, payload);
    if (configUpdated["affected"] === 0) {
      return {
        ok: false,
        status: 204,
        message: "No se pudo desactivar la configuración",
        error: { message: "No se puso eliminar la configuración" }
      }
    }
    return {
      ok: true,
      status: 200,
      message: "Configuración desactivada",
      datos: { ...configCustomerUpdated }
    }
  }

}
