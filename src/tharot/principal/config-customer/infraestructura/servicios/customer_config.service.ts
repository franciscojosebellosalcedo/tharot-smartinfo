import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigCustomerRepository } from '../../dominio/repository/config_custom.repository';
import { UpdateConfigCustomerDb, ConfigCustomerDb, ConfigCustomerData } from '../../dominio/valueobjects/config_custom.value';
import { CustomersConfigModel } from '../modelos/customer_config.model';

@Injectable()
export class CustomerConfigService implements ConfigCustomerRepository {
  constructor(@InjectRepository(CustomersConfigModel) private ConfigModel: Repository<CustomersConfigModel>) { }

  async enableAllConfigCustomer(): Promise<any> {
    let aux=0;
    const listConfigsCustomers=await this.ConfigModel.find();
    for (let i = 0; i < listConfigsCustomers.length; i++) {
      const config:ConfigCustomerData = listConfigsCustomers[i];
      const response=await this.ConfigModel.update({id:config.id},{status:1});
      if(response["affected"]>0){
        aux++;
      }
    }
    return aux;
  }

  async enableOneConfigCustomerById(idConfigCustomer: number): Promise<ConfigCustomerData> {
    await this.ConfigModel.update({id: idConfigCustomer},{status:1});
    return await this.ConfigModel.findOneBy({id: idConfigCustomer});
  }
  
  async deletePermanentConfigCustomer(idConfigCustomer: number): Promise<any> {
    return await this.ConfigModel.delete({id:idConfigCustomer});
  }

  async disableAllConfigsCustomers(): Promise<any> {
    const listConfigsCustomers=await this.ConfigModel.find();
    let aux=0;
    for (let i = 0; i < listConfigsCustomers.length; i++) {
      const config:ConfigCustomerData = listConfigsCustomers[i];
      const response=await this.ConfigModel.update({id:config.id},{status:0});
      if(response["affected"]>0){
        aux++;
      }
    }
    return aux;
  }

  async disableOneConfigCustomer(idConfigCustomer: number): Promise<ConfigCustomerData> {
    await this.ConfigModel.update({id:idConfigCustomer},{status:0});
    return await this.ConfigModel.findOneBy({id:idConfigCustomer});
  }

  async getAllConfigsCustomersAccordingStatus(status: number): Promise<ConfigCustomerData[]> {
    return await this.ConfigModel.find({where:{status:status}});
  }

  async deleteAllConfigsCustomers(): Promise<any> {
    const listConfigsCustomers=await this.ConfigModel.find();
    let aux=0;
    for (let i = 0; i < listConfigsCustomers.length; i++) {
      const config:ConfigCustomerData = listConfigsCustomers[i];
      const responseDeleted=await this.ConfigModel.delete({id:config.id});
      if(responseDeleted["affected"]>0){
        aux++;
      }
    }
    return aux;
  }

  async deleteAllConfigsCustomersAccordingStatus(status: number): Promise<any> {
    return await this.ConfigModel.delete({status:status});
  }
  
  async getAllConfigCustomer(): Promise<ConfigCustomerData[]> {
    return await this.ConfigModel.find();
  }

  async getConfigCustomer(idCustomer: number): Promise<ConfigCustomerDb> {
    return await this.ConfigModel.findOne({ where: { customer_id: idCustomer } })
  }

  async createConfigCustomer(data: ConfigCustomerData): Promise<ConfigCustomerData | null | any> {
    const confiFound=await this.ConfigModel.findOne({where:{customer_id:data.customer_id}});
    if(!confiFound){
      const configDB = this.ConfigModel.create(data);
      const saving=await this.ConfigModel.save(configDB);
      return {ok:true,datos:{...saving},message:"Configuración actualizada con exito",status:200};
    }
    const {configCustomerUpdated}= await this.updateConfigCustomer(data.customer_id,{...data});
    return {ok:true,datos:{...configCustomerUpdated},message:"Configuración establecida con exito",status:200};
  }

  async updateConfigCustomer(idCustomer: number, payload: UpdateConfigCustomerDb) {
    const configUpdated = await this.ConfigModel.update({ customer_id: idCustomer }, payload);
    const configCustomerUpdated = await this.ConfigModel.findOne({ where: { customer_id: idCustomer } });
    return { configUpdated, configCustomerUpdated };

  }

  async deleteConfigCustomer(idCustomer: number) {
    const configDB = await this.ConfigModel.findOne({ where: { customer_id: idCustomer } });
    configDB.status = 0;
    return await this.ConfigModel.save(configDB);
  }

}
