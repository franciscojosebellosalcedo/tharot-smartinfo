export interface createForm{
    customer_id: number,
    titulo: string,
    table_db: string,
    delete_reg: number,
    status?: number
}


export interface updateForm{
    titulo? : string,
    table_db? : string,
    delete_reg? : number,
    status? : number
}