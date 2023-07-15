import { ModuloData, UpdateModuloData } from "../valueObject/modulo.value";

export interface moduloRepository{
    updateModuloById(idModulo:number,newData:UpdateModuloData):Promise<ModuloData | null>;

    disableAllModulo():Promise<any>;
    disableModuloById(idModulo:number):Promise<ModuloData | null>;

    enableModuloById(idModulo:number):Promise<any>;
    enableAllModulo():Promise<any>;

    saveChangesModulo(modulo:ModuloData):Promise<void>;

    deleteAllModulo():Promise<any>;
    deleteAllModuloAccordingStatus(status:number):Promise<any>;
    deleteModuloById(idModulo:number):Promise<any>;

    getAllModuloAccordingStatus(status:number):Promise<ModuloData[] | null>;
    getOneModuloById(idModulo:number):Promise<ModuloData | null>;
    getAllModulo():Promise<ModuloData[] | null>;

    createModulo(body:ModuloData):Promise<ModuloData | null>;
}