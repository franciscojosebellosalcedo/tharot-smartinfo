import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { MethodRepository } from "../../dominio/repository/method.respository";
import {
  MethodData,
  UpdateMethod,
} from "../../dominio/valueobject/method.value";
import { Method as methodModel } from "../modelos/method.model";

@Injectable()
export class MethodService implements MethodRepository {
  constructor(
    @InjectRepository(methodModel) private MethodlModel: Repository<methodModel>
  ) { }

  async deleteAllMethods(): Promise<any> {
    const methods=await this.MethodlModel.find();
    let aux=0;
    for (let i = 0; i < methods.length; i++) {
      const method:MethodData = methods[i];
      const response=await this.MethodlModel.delete({id:method.id});
      if(response["affected"]>0){
        aux++;
      }
    }
    return aux;
  }

  async disableMethodById(idMethod: number): Promise<MethodData> {
    await this.MethodlModel.update({id: idMethod},{status:0});
    return await this.MethodlModel.findOneBy({id: idMethod});
  }

  async disableAllMethods(): Promise<any> {
    const listMethods=await this.MethodlModel.find();
    let aux=0;
    for (let i = 0; i < listMethods.length; i++) {
      const method:MethodData = listMethods[i];
      const response=await this.MethodlModel.update({id:method.id},{status:0});
      if(response["affected"]>0){
        aux++;
      }
    }
    return aux;
  }

  async deleteMethodById(idMethod: number): Promise<any> {
    return await this.MethodlModel.delete({id: idMethod});
  }

  async deleteAllMetthosAccordingStatus(status: number): Promise<any> {
    return await this.MethodlModel.delete({status: status});
  }

  async getAllMethodsAccordingStatus(status: number): Promise<MethodData[]> {
    return await this.MethodlModel.find({where:{status:status}});
  }

  async enableMethod(id: number): Promise<{} | any> {
    const methodFound = await this.MethodlModel.findOne({ where: { id: id } });
    if (!methodFound) {
      return {
        msg: "Método de autenticación no encontrado", ok: false, data: methodFound
      }
    }
    if (methodFound.status === 1) {
      return {
        msg: "Método de autenticación está activo", ok: false, data: methodFound
      }
    }
    methodFound.status = 1;
    this.MethodlModel.save(methodFound);
    return {
      msg: "Método de autenticación activado con exito", ok: true, data: methodFound
    }
  }

  async validateMethods(listIdMethods: []): Promise<any> {
    let count = listIdMethods.length, listIdNotFound = [];
    if (listIdMethods.length === 0) return { ok: false, idNotFound: [], message: "No se encontró ningún id dentro del array" };
    for (let i = 0; i < listIdMethods.length; i++) {
      const idMethod = listIdMethods[i];
      const method = await this.MethodlModel.findOne({ where: { id: idMethod } });
      if (!method) {
        listIdNotFound = [...listIdNotFound, idMethod]
        count--;
      }
    }
    if (count < listIdMethods.length && listIdNotFound.length > 0) {
      return { ok: false, idNotFound: [...listIdNotFound], message: "Algunos id que están dentro del array, no se encuentran en la tabla de auth-method" }
    } else {
      return { ok: true, idNotFound: [], message: "Todo ok" }
    }
  }

  async getMethod(id: number): Promise<MethodData> {
    return await this.MethodlModel.findOne({ where: { id } });
  }

  async getAllMethods(): Promise<MethodData[]> {
    return await this.MethodlModel.find();
  }

  async createMethod(data: MethodData): Promise<MethodData> {
    const methodFound=await this.MethodlModel.findOne({where:{name:data.name.toLowerCase()}});
    if(methodFound){
      return null;
    }
    const method =  this.MethodlModel.create(data);
    method.name=method.name.toLowerCase();
    return await this.MethodlModel.save(method);
  }

  async updateMethod(id: number, payload: UpdateMethod) {
    const method = await this.MethodlModel.findOne({ where: { id } });
    const methodUpdate = { ...method, ...payload };
    return await this.MethodlModel.save(methodUpdate);
  }

  async deleteMethod(id: number) {
    const method = await this.MethodlModel.findOne({ where: { id } });
    method.status = 0;
    return await this.MethodlModel.save(method);
  }

  async countMethod() {
    return await this.MethodlModel.count();
  }
}
