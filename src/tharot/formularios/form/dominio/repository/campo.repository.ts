import {CampoData, UpdateCampo} from '../valueobject/campo.value';

export interface campoRepository {
    getAllCampoByIdForm(form_id:number):Promise<CampoData[] | null>;
    createCampo(data: CampoData) : Promise<CampoData | null>;
    getCampo(id:number) : Promise<CampoData | null>;
    getCampoByIdForm(idForm:number) : Promise<CampoData | null>;
    listCampo(id:number) : Promise<CampoData[] | null>;
    updateCampoById(idCampo: number, data:UpdateCampo) : Promise<CampoData | null>;
    deleteCampo(id: number) : Promise<CampoData | null>;
    deleteCampoById(id: number) : Promise<any | null>;
}