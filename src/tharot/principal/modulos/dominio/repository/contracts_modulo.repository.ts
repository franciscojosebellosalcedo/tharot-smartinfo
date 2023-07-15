import { ContractsModuloData, ExtendDateContractData, UpdateContractModuloData } from "../valueObject/contracts_modulo.value";

export interface contractsModuloRepository{
    // updateContractModuloById(idContractModulo:number,newData:UpdateContractModuloData):Promise<ContractsModuloData | null>;

    deleteAllContractsModuloAccordingStatus(idCustomer:number,status:number):Promise<any>;
    deleteAllContractsModuloByIdModulo(idModulo:number): Promise<any>;
    deleteAllContractsModuloByIdCustomer(idCustomer:number):Promise<any>;
    deleteAllContractsModulo():Promise<any>;
    deleteContractsModuloById(idContractModulo:number):Promise<any>;

    saveChangesContractModulo(contractModulo:ContractsModuloData):Promise<void>;
    
    extendDateExpirationContractById(idContractModulo:number,date:ExtendDateContractData):Promise<ContractsModuloData | null>;
    changeValidityContractModuloById(idContractModulo:number,validity:string):Promise<ContractsModuloData | null>;

    getAllContractsModuloFinalized():Promise<ContractsModuloData[] | null>;
    getAllContractsModuloByIdModulo(idModulo:number):Promise<ContractsModuloData[] | null>;
    getAllContractsModuloByIdCustomer(idCustomer:number):Promise<ContractsModuloData[] | null>;
    getOneContractModuloById(idContractModulo:number):Promise<ContractsModuloData | null>;
    getAllContractsModulo():Promise<ContractsModuloData[]| null>;
    getContractByIdCustomerByIdModulo(idCustomer:number,idModulo:number):Promise<ContractsModuloData | null>;

    createContractModulo(body:ContractsModuloData):Promise<ContractsModuloData| null>;
}