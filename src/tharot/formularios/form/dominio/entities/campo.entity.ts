export interface createCampo{
    form_id?: number,
    label: string,
    name_bd: string,
    type: string,
    format: string,
    required: number,
    order: number,
    unique: number,
    max_length: number,
    width: string,
    options?: string,
    status?: number
}


export interface updateCampo{
    form_id?: number,
    label?: string,
    name_bd?: string,
    type?: string,
    format?: string,
    required?: number,
    order?: number,
    unique?: number,
    max_length?: number,
    width?: string,
    status?: number
}