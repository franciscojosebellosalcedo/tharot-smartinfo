import {FormData, UpdateForm} from '../valueobject/form.value';

export interface formRepository {
    getAllFormsByIdCustomer(idCustomer:number):Promise<FormData[] | null>
    getAllFormsAccordingStatus(status:number):Promise<FormData[] | null>;
    getAllForms():Promise<FormData[] | null>;
    getForm(id:number) : Promise<FormData | null>;
    getFormByName(tableDb:string) : Promise<FormData | null>;

    deleteAllFormsAccordingStatus(status:number):Promise<any>;
    deleteFormById(idForm:number):Promise<any>;
    createForm(data: FormData) : Promise<FormData | null>;
    listForm(id:number) : Promise<FormData[] | null>;

    updateForm(id: number, data:UpdateForm) : Promise<FormData | null>;
    disabledFormById(id: number) : Promise<FormData | null>;
    enabledFormById(form_id:number):Promise<FormData | null>;

    validateNameTable(nameTable:string):Promise<boolean>;
}