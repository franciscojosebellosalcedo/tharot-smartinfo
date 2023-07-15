export interface sub_menu{
    id?:number;
    menu_id:number;
    name:string;
    orden: number;
    type_form?:number;
    id_form?:number;
    acciones:string;
    status?:number;
}

export interface move_sub_menu {
    id_sub:number;
    id_destination:number;
}