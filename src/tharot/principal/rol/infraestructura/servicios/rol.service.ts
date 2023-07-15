import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RolRepository } from '../../dominio/repository/rol.respository';
import { RolData } from '../../dominio/valueobject/rol.value';
import { Rol as rolModel } from '../modelos/rol.model';
@Injectable()
export class RolService implements RolRepository {
  constructor(@InjectRepository(rolModel) private RolModel: Repository<rolModel>) { }
  
  async enableAllRols(): Promise<any> {
    const listRols=await this.RolModel.find();
    let aux=0;
    for (let i = 0; i < listRols.length; i++) {
      const rol:RolData = listRols[i];
      const response=await this.RolModel.update({id:rol.id},{status:1});
      if(response["affected"]>0){
        aux++;
      }
    }
    return aux;
  }
  
  async getAllRolAccordingStatus(status: number): Promise<RolData[]> {
    return await this.RolModel.find({where:{status:status}});
  }

  async deleteRolById(idRol: number): Promise<any> {
    return await this.RolModel.delete({id:idRol});
  }

  async deleteAllRolsAccordingStatus(status: number): Promise<any> {
    return await this.RolModel.delete({status: status});
  }

  async deleteAllRols(): Promise<any> {
    const listRols=await this.RolModel.find();
    let aux=0;
    for (let i = 0; i < listRols.length; i++) {
      const rol:RolData = listRols[i];
      const response=await this.RolModel.delete({id:rol.id});
      if(response["affected"]>0){
        aux++;
      }
    }  
    return aux;
  }

  async disableAllRols(): Promise<any> {
    const listRols=await this.RolModel.find();
    let aux=0;
    for (let i = 0; i < listRols.length; i++) {
      const rol:RolData = listRols[i];
      const rolDisabled=await this.disableRolById(rol.id);
      if(rolDisabled.status===0){
        aux++;
      }
    }  
    return aux;  
  }

  async disableRolById(idRol: number): Promise<RolData> {
    await this.RolModel.update({id: idRol},{status:0});
    return await this.RolModel.findOneBy({id: idRol});
  }

  async enableRol(id: number): Promise<boolean | any> {
    const rolFound = await this.RolModel.findOne({ where: { id: id } });
    if (!rolFound) {
      return {
        msg: "Rol no encontrado", ok: false, data: rolFound
      }
    }
    if(rolFound.status===1){
      return {
        msg: "Este rol ya esta activo", ok: false, data: rolFound
      }
    }
    rolFound.status = 1;
    await this.RolModel.save(rolFound);
    return {
      msg:"Rol activado con exito",ok:true,data: rolFound
    }
  }

  async getRol(id: number): Promise<rolModel | any> {
    const rolFound = await this.RolModel.findOne({ where: { id } });
    return rolFound;
  }

  async getAllRols(): Promise<rolModel[]> {
    return await this.RolModel.find();
  }

  async createRol(data: RolData): Promise<rolModel> {
    const rolFound = await this.RolModel.findOne({ where: { name: data.name.toLowerCase() } });
    if (rolFound) {
      return null;
    }
    data.name = data.name.toLowerCase();
    const rol = this.RolModel.create(data);
    return await this.RolModel.save(rol);
  }

  async updateRol(id: number, payload: RolData) {
    payload.name=payload.name.toLowerCase();
    const rol = await this.RolModel.findOne({ where: { id } });
    if(!rol){
      return rol;
    }
    await this.RolModel.update(id,payload);
    const rolUpdated = await this.RolModel.findOne({ where: { id } });
    return rolUpdated;
  }

  async deleteRol(id: number): Promise<RolData | any> {
    const rol = await this.RolModel.findOne({ where: { id } });
    if(!rol){
      return {
        msg:"No se encontró el rol"
      }
    }
    rol.status = 0;
    return await this.RolModel.save(rol);
  }

  async countRol(): Promise<any>{
      return await this.RolModel.count();
  }
}
