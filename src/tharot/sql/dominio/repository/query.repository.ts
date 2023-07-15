import { CampoData } from "../../../formularios/form/dominio/valueobject/campo.value";

export interface EntityRepo {
    getOneRegisterTableByNameById(idRegister:number,nameTable:string):Promise<any>;
    updateRegisterTableByNameById(idRegister: number, nameTable: string,data:object): Promise<any>;
    deleteRegisterTableByNameById(idRegister: number, nameTable: string): Promise<any>;
    enabledRegisterTableByNameById(idRegister: number, nameTable: string): Promise<any>;
    createTable(nameTable: string, campos: CampoData[]): Promise<any>;
    getAllDataTableByIdForm(form: object): Promise<any[]>;
    insertDataTable(nameTable: string, data: object): Promise<any>;
}