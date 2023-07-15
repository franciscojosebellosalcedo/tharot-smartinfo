import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Mc as mcModel } from '../modelos/mc.model';
import { McRepository } from '../../dominio/repository/mc.repository';
import {
  McData,
  McUpdateData
} from '../../dominio/valueobject/mc.value';

@Injectable()
export class McService implements McRepository {
  constructor(
    @InjectRepository(mcModel) private McModel: Repository<mcModel>
  ) { }

  async deleteAllMCs(idCustomer: number): Promise<any> {
    return await this.McModel.delete({customer_id:idCustomer});
  }

  async getAllMcsByIdCustomer(idCustomer:number): Promise<McData[]> {
    return await this.McModel.find({where:{customer_id:idCustomer}});
  }

  async enableMC(id: number): Promise<{} | any> {
    const mcFound=await this.McModel.findOne({where:{id:id}});
    if(!mcFound){
      return {
        msg:"Auth-method no encontrado",ok:false,data:mcFound
      }
    }
    if(mcFound.status===1){
      return {
        msg:"Auth-method está activo",ok:false,data:mcFound
      }
    }
    mcFound.status=1;
    this.McModel.save(mcFound);
    return {
      msg:"Auth-method activado con exito",ok:false,data:mcFound
    }
  }

  async getMc(id: number): Promise<McData> {
    return await this.McModel.findOne({ where: { id } });
  }

  async getAllMcs(): Promise<McData[]> {
    return await this.McModel.find();
  }

  async createMc(data: McData): Promise<McData> {
    const mc =  this.McModel.create(data);
    return await this.McModel.save(mc);
  }

  async updateMc(id: number, payload: McUpdateData) {
    const mc = await this.McModel.findOne({ where: { id } });
    const mcUpdate = { ...mc, ...payload };
    return await this.McModel.save(mcUpdate);
  }
}
