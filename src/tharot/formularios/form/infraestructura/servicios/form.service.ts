import { Injectable } from '@nestjs/common';
import { Form as FormModel } from '../modelos/form.model';
import { formRepository } from '../../dominio/repository/form.repository';
import { FormData, UpdateForm } from '../../dominio/valueobject/form.value';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FormService implements formRepository {
  constructor(@InjectRepository(FormModel) private formModel: Repository<FormModel>) { }

  async getAllFormsByIdCustomer(idCustomer: number): Promise<FormData[]> {
    return await this.formModel.find({where:{customer_id:idCustomer}});
  }
  
  async getAllFormsAccordingStatus(status: number): Promise<FormData[]> {
    return await this.formModel.find({where:{status:status}});
  }
  
  async deleteAllFormsAccordingStatus(status: number): Promise<any> {
    return await this.formModel.delete({status:status});
  }

  async getAllForms(): Promise<FormData[]> {
    return await this.formModel.find();
  }

  async deleteFormById(idForm: number): Promise<any> {
    return await this.formModel.delete({id: idForm});
  }

  async getFormByName(tableDb: string): Promise<FormData> {
    const form = await this.formModel.findOne({where:{table_db:tableDb}});
    return form;
  }

  async validateNameTable(nameTable: string): Promise<boolean> {
    let count=0;
    const forms=await this.formModel.find();
    for (let i = 0; i < forms.length; i++) {
      const form = forms[i];
      if (form.table_db.toLowerCase()===nameTable.toLowerCase()) {
        count++;
        i=forms.length;
      }
    }
    if(count>0) return true;
    return false;
  }

  async enabledFormById(form_id: number): Promise<FormData> {
    const formFound = await this.formModel.findOne({ where: { id: form_id } });
    if(!formFound){
      return null;
    }
    if (formFound.status === 1) {
      return null;
    }
    formFound.status = 1;
    await this.formModel.save(formFound);
    return formFound;
  }

  async disabledFormById(id: number): Promise<FormData> {
    const formFound = await this.formModel.findOne({ where: { id: id } });
    if(!formFound){
      return null;
    }
    if (formFound.status === 0) {
      return null;
    }
    formFound.status = 0;
    await this.formModel.save(formFound);
    return formFound;
  }

  async createForm(data: FormData): Promise<FormData> {
    const formDB = this.formModel.create(data);
    return await this.formModel.save(formDB);
  }

  async getForm(id: number): Promise<FormData> {
    return await this.formModel.findOne({ where: { id } });
  }

  async listForm(customer_id: number): Promise<FormData[]> {
    return await this.formModel.find({ where: { customer_id: customer_id } });
  }

  async updateForm(id: number, data: UpdateForm): Promise<FormData> {
    const formDB = await this.getForm(id);
    const updated = { ...formDB, ...data };
    return await this.formModel.save(updated);
  }

  async deleteForm(id: number): Promise<FormData> {
    const formDB = await this.getForm(id);
    formDB.status = 0;
    return this.formModel.save(formDB);
  }
}
