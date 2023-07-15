import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { contractsModuloRepository } from "../../dominio/repository/contracts_modulo.repository";
import { ContractsModuloData, ExtendDateContractData, UpdateContractModuloData } from "../../dominio/valueObject/contracts_modulo.value";
import { ContractsModuloModel } from "../modelos/contracts_modulo.model";

@Injectable()
export class ContractsModuloService implements contractsModuloRepository {
  constructor(@InjectRepository(ContractsModuloModel) private _contractsModulo: Repository<ContractsModuloModel>) { }
  
  async saveChangesContractModulo(contractModulo: ContractsModuloData) {
    await this._contractsModulo.save(contractModulo);
  }

  // async updateContractModuloById(idContractModulo: number, newData: UpdateContractModuloData): Promise<ContractsModuloData> {
  //   await this._contractsModulo.update({id: idContractModulo}, newData);
  //   return await this._contractsModulo.findOne({where:{id: idContractModulo}});
  // }

  async changeValidityContractModuloById(idContractModulo: number, validity: string): Promise<ContractsModuloData> {
    await this._contractsModulo.update({id: idContractModulo},{validity: validity});
    return this._contractsModulo.findOne({where:{id: idContractModulo}});
  }
  
  async deleteAllContractsModuloAccordingStatus(idCustomer: number, status: number): Promise<any> {
    return await this._contractsModulo.delete({id_customer:idCustomer,status:status});
  }

  async deleteAllContractsModuloByIdModulo(idModulo: number) {
    return await this._contractsModulo.delete({id_modulo:idModulo});
  }
  
  async deleteAllContractsModuloByIdCustomer(idCustomer: number): Promise<any> {
    return await this._contractsModulo.delete({id_customer: idCustomer});
  }
  
  async deleteAllContractsModulo(): Promise<any> {
    const listContracts=await this._contractsModulo.find();
    let aux=0;
    for (let i = 0; i < listContracts.length; i++) {
      const contractModulo:ContractsModuloData = listContracts[i];
      await this._contractsModulo.delete({id:contractModulo.id});
      aux++;
    }
    return aux;
  }
  
  async deleteContractsModuloById(idContractModulo: number): Promise<any> {
    return await this._contractsModulo.delete({id: idContractModulo});
  }
  
  async extendDateExpirationContractById(idContractModulo: number, body: ExtendDateContractData): Promise<ContractsModuloData> {
    await this._contractsModulo.update({id:idContractModulo},{date_expiration:body.date});
    return await this.getOneContractModuloById(idContractModulo);
  }

  async getAllContractsModuloFinalized(): Promise<ContractsModuloData[]> {
    return await this._contractsModulo.find({where:{status:0}});
  }
  
  async getAllContractsModuloByIdModulo(idModulo: number): Promise<ContractsModuloData[]> {
    return await this._contractsModulo.find({where:{id_modulo: idModulo}});
  }
  
  async getAllContractsModuloByIdCustomer(idCustomer: number): Promise<ContractsModuloData[]> {
    return await this._contractsModulo.find({where:{id_customer:idCustomer}});
  }
  
  async getOneContractModuloById(idContractModulo: number): Promise<ContractsModuloData> {
    return await this._contractsModulo.findOneBy({id:idContractModulo});
  }
  
  async getAllContractsModulo(): Promise<ContractsModuloData[]> {
    return await this._contractsModulo.find();
  }

  async getContractByIdCustomerByIdModulo(idCustomer: number, idModulo: number): Promise<ContractsModuloData> {
    return await this._contractsModulo.findOneBy({id_customer:idCustomer,id_modulo:idModulo});
  }
  
  async createContractModulo(body: ContractsModuloData): Promise<ContractsModuloData> {
    const contractModuloCreated= this._contractsModulo.create(body);
    return await this._contractsModulo.save(contractModuloCreated);
  }

}