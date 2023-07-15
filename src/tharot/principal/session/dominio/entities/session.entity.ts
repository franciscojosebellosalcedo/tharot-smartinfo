export interface InterfaceSessionModel{
    id?:number;
    user_id:string;
    token:string;
    date_login:Date;
    date_logout:Date;
    ip_device:string;
    name_device:string;
    name_country:string;
    city:string;
    region:string;
    status?:number;
}