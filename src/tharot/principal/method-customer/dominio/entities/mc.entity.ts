export interface mc {
    id?: number,
    method_id: number,
    customer_id: number,
    status?: number 
}

export interface mc_update {
    method_id?: number,
    customer_id?: number,
    status?: number 
}