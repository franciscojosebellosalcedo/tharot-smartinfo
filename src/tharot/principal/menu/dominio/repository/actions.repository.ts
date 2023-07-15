import { ActionsData, UpdateActionData } from "../valueobject/actions.value";

export interface actionsRepository{
    getOneActionByIdActionByIdForm(idForm: number): Promise<ActionsData> ;
    getAllActions():Promise<ActionsData[] | null>;
    getOneActionByIdAction(idAction: number):Promise<ActionsData | null>;
    editAction(idAction:number,body:UpdateActionData):Promise<any>;
    enableAction(idAction:number):Promise<ActionsData | null>;
    disableAction(idAction:number):Promise<ActionsData | null>;
    deleteAction(idAction:number):Promise<any>;
    deleteAllAction():Promise<ActionsData[] | null>;
    createAction(body:ActionsData):Promise<ActionsData | null>;
}