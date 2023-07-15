import { CustomersData, UpdateCustomersData } from "../valueobject/customers.value";
//interface del repositorio de customer, este contiene todos los metodos que seran llamados
export interface InterfaceCustomersRepository{
    createCustomer(newCustomer:CustomersData):Promise<CustomersData | any>;

    deleteAllCustomers(idCustomer:number):Promise<any>;
    deleteCustomerById(customerId:number):Promise<any>;
    deleteCustomer(customerId:number):Promise<CustomersData | null>;

    getAllCustomersAccordingStatus(status:number):Promise<CustomersData[] | null>;
    getAllCustomers():Promise<CustomersData[] | null>;
    getCustomerById(customerId:number):Promise<CustomersData | null>;
    getCustomerBy_Id(customerId:number):Promise<CustomersData | null>;

    updateCustomer(customerId:number,newData:UpdateCustomersData):Promise<CustomersData | any>;

    enableCustomer(customerId:number):Promise<CustomersData | any>;
}