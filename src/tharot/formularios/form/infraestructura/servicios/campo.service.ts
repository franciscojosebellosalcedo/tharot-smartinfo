import { Injectable } from "@nestjs/common";
import { campo as CampoModel } from "../modelos/campo.model";
import { campoRepository } from "../../dominio/repository/campo.repository";
import { CampoData, UpdateCampo } from "../../dominio/valueobject/campo.value";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class CampoService implements campoRepository {
  constructor(
    @InjectRepository(CampoModel) private campoModel: Repository<CampoModel>
  ) { }

  async deleteCampoById(id: number): Promise<any> {
    return await this.campoModel.delete({id:id});
  }

  async getAllCampoByIdForm(form_id: number): Promise<CampoData[]> {
    const listCampo = await this.campoModel.find({ where: { form_id: form_id } });
    return listCampo;
  }

  async getCampoByIdForm(idForm: number): Promise<CampoData> {
    return await this.campoModel.findOne({ where: { form_id: idForm } });
  }

  async createCampo(data: CampoData): Promise<CampoData> {
    const formDB = this.campoModel.create(data);
    return await this.campoModel.save(formDB);
  }

  async getCampo(id: number): Promise<CampoData> {
    return await this.campoModel.findOne({ where: { id } });
  }

  async listCampo(form_id: number): Promise<CampoData[]> {
    return await this.campoModel.find({ where: { form_id: form_id } });
  }

  async updateCampoById(idCampo: number, data: UpdateCampo): Promise<CampoData> {
    const camposDB = await this.getCampo(idCampo);
    if (!camposDB) {
      return null;
    }
    const updated = { ...camposDB, ...data };
    return await this.campoModel.save(updated);
  }

  async deleteCampo(id: number): Promise<CampoData> {
    const campoDB = await this.getCampo(id);
    campoDB.status = 0;
    return this.campoModel.save(campoDB);
  }
  
  async enabledCampo(id: number): Promise<CampoData> {
    const campoDB = await this.getCampo(id);
    campoDB.status = 1;
    return this.campoModel.save(campoDB);
  }
}
