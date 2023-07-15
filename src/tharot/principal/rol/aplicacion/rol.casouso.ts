import { RolRepository } from "../dominio/repository/rol.respository";
import { RolData, UpdateRol } from "../dominio/valueobject/rol.value";

export class RolCasoUso {
  constructor(private readonly rolRepository: RolRepository) { }

  async enableAllRols() {
    const listRol=await this.rolRepository.getAllRols();
    if(listRol.length===0){ 
      return {ok:false,status:204,message:"No existen rol registrados en la aplicación"};
    }
    let aux=0;
    for (let i = 0; i < listRol.length; i++) {
      const rol:RolData = listRol[i];
      if (rol.status===1) {
        aux++;
      }
    }
    if(aux===listRol.length){
      return {ok:false,status:200,message:"Todos los rol están activos"};
    }
    const responseEnabled=await this.rolRepository.enableAllRols();
    if(responseEnabled===0){
      return {ok:false,status:203,message:"No se pudo activar ningún rol"};
    }
    return {ok:true,status:200,message:"Todos los roles fueron activados con éxito"};
  }

  async getAllRolAccordingStatus(status: number) {
    if(status<0 || status>1){
      return {ok:false,status:204,message:"Valor no valido del filtro (status no valido) 1 activos 0 inactivos"};
    }
    const listRols=await this.rolRepository.getAllRolAccordingStatus(status);
    if(listRols.length===0){
      return {ok:false,status:204,message:`No existen roles ${status===1?"activos":"inactivos"}`};
    }
    return {ok:true,status:200,message:`Roles ${status===1?"activos":"inactivos"}`};
  }

  async deleteRolById(idRol: number) {
    const response=await this.rolRepository.deleteRolById(idRol);
    if(response["affected"]===0){
      return {ok:false,status:204,message:"Rol no existente en la aplicación"};
    }
    return {ok:true,status:200,message:"Rol eliminado con exito"};
  }

  async deleteAllRolsAccordingStatus(status: number) {
    if(status<0 || status>1){
      return {ok:false,status:204,message:"Valor no valido del filtro (status no valido) 1 activos 0 inactivos"};
    }
    const response=await this.rolRepository.deleteAllRolsAccordingStatus(status);
    if(response["affected"]===0){
      return {ok:false,status:204,message:`No existen roles ${status===1?"activos":"inactivos"}`};
    }
    return {ok:true,status:200,message:`Todos los roles ${status===1?"activos":"inactivos"} se eliminaron con éxito`};
  }

  async deleteAllRols() {
    const responseDeletedAllRols=await this.rolRepository.deleteAllRols();
    if(responseDeletedAllRols===0){
      return {ok:false,status:404,message:"No existen rol registrados en la aplicación"};
    }

    return {ok:true,status:200,message:"Todos los roles fueron eliminados con éxito"};
  }

  async disableAllRols() {
    const listRols=await this.rolRepository.getAllRols();
    if(listRols.length===0){ 
      return {ok:false,status:204,message:"No existen rol registrados en la aplicación"};
    }
    let aux=0;
    for (let i = 0; i < listRols.length; i++) {
      const rol:RolData = listRols[i];
      if(rol.status===0){
        aux++;
      }
    }
    if(aux===listRols.length){
      return {ok:false,status:200,message:"Todos los rol están inactivos"};
    }
    const responseDisabledAllRols=await this.rolRepository.disableAllRols();
    if(responseDisabledAllRols===0){
      return {ok:false,status:204,message:"No se pudo desactivar ningún rol"};
    } 
    return {ok:true,status:200,message:"Todos los roles fueron desactivados con éxito"};
  }

  async disableRolById(idRol: number) {
    const rolFound=await this.rolRepository.getRol(idRol);
    if(!rolFound){
      return {ok:false,status:404,message:"Rol no existente en la aplicación"};
    }
    if(rolFound.status===0){
      return {ok:false,status:200,message:"Este rol actualmente está inactivo en la aplicación"};
    }
    const rolDisabled=await this.rolRepository.disableRolById(idRol);
    if(!rolDisabled){
      return {ok:false,status:404,message:"Rol no existente en la aplicación"};
    }else if(rolDisabled.status===1){
      return {ok:false,status:204,message:"No se pudo desactivar el rol"};
    }
    return {ok:true,status:200,message:"Rol desactivado con éxito"};
  }

  async getRol(id: number) {
    //retorno de lo que retorna el metodo getRol(id) que proviene de  la interface rolRepository
    const rol = await this.rolRepository.getRol(id);
    
    if (!rol) {
      return {
        ok: false,
        message: "Error mostrando el rol.",
        error: rol
      }
    }

    return {
      ok: true,
      message: "Detalles del rol.",
      datos: rol
    }    
  }

  async getAllRol() {
    const rol = await this.rolRepository.getAllRols();
    
    if (!rol) {
      return {
        ok: false,
        message: "Error listando los roles.",
        error: rol
      }
    }

    return {
      ok: true,
      message: "Lista de roles.",
      datos: rol
    }   
  }

  async createRol(data: RolData) {
    data.name = data.name.trim();
    //retorna lo que la funcion createRol(data) devuelve despues de haber agregado un rol en la base de datos
    const rol = await this.rolRepository.createRol(data);
    
    if (!rol) {
      return {
        ok: false,
        message: "Error creando el rol.",
        error: rol
      }
    }

    return {
      ok: true,
      message: "Rol creado con exito.",
      datos: rol
    }  
  }

  async updateRol(id: number, data: UpdateRol) {
    data.name=data.name.trim();
    const rol = await this.rolRepository.updateRol(id, data);
    
    if (!rol) {
      return {
        ok: false,
        message: "Error actualizando el rol.",
        error: rol
      }
    }

    return {
      ok: true,
      message: "Rol actualizado con exito.",
      datos: rol
    } 
  }

  async deleteRol(id: number) {
    const rol = await this.rolRepository.deleteRol(id);
    
    if (!rol) {
      return {
        ok: false,
        message: "Error eliminando el rol.",
        error: rol
      }
    }

    return {
      ok: true,
      message: "Rol eliminado con exito.",
      datos: rol
    } 
  }

  // Funcion: enableRol(id:number) parametro id de tipo number (identificador de un rol en especifico de la base de datos) 
  // Fecha: 2023/04/11
  // Autor: Francisco bello
  // Descripcion: metodo para activar un rol de la base de datos (status 1)
  async enableRol(id: number) { 
    const rolFound=await this.rolRepository.getRol(id);
    if(!rolFound){
      return {ok:false,status:200,message:"Rol no existente en la aplicación"};
    }else if(rolFound.status===1){
      return {ok:false,status:200,message:"Este rol actualmente está activo en la aplicación"};
    }
    const rol = this.rolRepository.enableRol(id);
    if (!rol) {
      return {
        ok: false,
        message: "Error inhabilitando el rol.",
        error: rol
      }
    }
    return {
      ok: true,
      message: "Rol activado con exito.",
    } 
  }
}
