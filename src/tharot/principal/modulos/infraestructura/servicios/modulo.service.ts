import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { moduloRepository } from "../../dominio/repository/modulo.repository";
import { ModuloData, UpdateModuloData } from "../../dominio/valueObject/modulo.value";
import { ModuloModel } from "../modelos/modulo.model";

@Injectable()
export class ModuloService implements moduloRepository {
  constructor(@InjectRepository(ModuloModel) private _modulo: Repository<ModuloModel>) { }
  
  async saveChangesModulo(modulo: ModuloData): Promise<void> {
    await this._modulo.save(modulo);
  }
  
  async enableModuloById(idModulo: number): Promise<any> {
    return await this._modulo.update({id:idModulo},{status:1});
  }

  async enableAllModulo(): Promise<any> {
    const listModulos=await this._modulo.find();
    let aux=0;
    for (let i = 0; i < listModulos.length; i++) {
      const modulo = listModulos[i];
      await this._modulo.update({id:modulo.id},{status:1});
      aux++;
    }
    return aux;
  }

  async deleteAllModuloAccordingStatus(status: number): Promise<any> {
    return await this._modulo.delete({status: status});
  }

  async updateModuloById(idModulo: number,newData:UpdateModuloData): Promise<ModuloData> {
    await this._modulo.update({id:idModulo},newData);
    return this._modulo.findOneBy({id:idModulo});
  }

  async disableAllModulo(): Promise<any> {
    const listModulos=await this._modulo.find();
    let aux=0;
    for (let i = 0; i < listModulos.length; i++) {
      const modulo = listModulos[i];
      await this._modulo.update({id:modulo.id},{status:0});
      aux++;
    }
    return aux;
  }

  async disableModuloById(idModulo: number): Promise<ModuloData> {
    await this._modulo.update({id: idModulo},{status:0});
    return await this._modulo.findOneBy({id:idModulo});
  }

  async deleteAllModulo(): Promise<any> {
    const listModulos=await this._modulo.find();
    let aux=0;
    for (let i = 0; i < listModulos.length; i++) {
      const modulo = listModulos[i];
      await this._modulo.delete({id: modulo.id});
      aux++;
    }
    return aux;
  }

  async deleteModuloById(idModulo: number): Promise<any> {
    return await this._modulo.delete({id:idModulo});
  }

  async getAllModuloAccordingStatus(status: number): Promise<ModuloData[]> {
    return await this._modulo.find({where:{status:status}});
  }

  async getOneModuloById(idModulo: number): Promise<ModuloData> {
    return await this._modulo.findOne({where:{id: idModulo}});
  }

  async getAllModulo(): Promise<ModuloData[]> {
    return await this._modulo.find();
  }

  async createModulo(body: ModuloData): Promise<ModuloData> {
    const moduloCreated= this._modulo.create(body);
    return await this._modulo.save(moduloCreated);
  }

}