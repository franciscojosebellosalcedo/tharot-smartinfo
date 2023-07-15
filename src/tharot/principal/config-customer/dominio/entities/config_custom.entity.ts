export interface configCustomer{
    customer_id: number,
    primary_color: string,
    secondary_color: string,
    icon_menu: string,
    font_size: string,
    font_family: number,
    time_zone: number,
    status?: number
}


export interface updateConfigCustomer{
    primary_color ?: string,
    secondary_color ?: string,
    tertiary_color ?: string,
    dark_mode ?: boolean,
    icon_menu ?:  string,
    font_family ?: string,
}

export interface updateConfigCustomerDb{
    primary_color ?: string,
    secondary_color ?: string,
    tertiary_color ?: string,
    icon_menu ?: Buffer,
    font_family ?: string,
    status ?: number
}

export interface configCustomerDb{
    id?: number,
    customer_id: number,
    primary_color: string,
    secondary_color: string,
    tertiary_color: string,
    icon_menu: Buffer,
    dark_mode: boolean,
    font_family: string,
    status?: number
}