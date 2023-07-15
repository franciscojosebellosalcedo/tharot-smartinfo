//interface de la entidad customer 
export interface InterfaceEntityCustomers{
    id?:number;
    logo?: Buffer;
    nit:string;
    name:string;
    address:string;
    phone:string;
    email:string;
    status?:number;
}