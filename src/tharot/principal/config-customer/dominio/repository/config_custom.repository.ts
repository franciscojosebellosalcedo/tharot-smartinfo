import {  ConfigCustomerData, ConfigCustomerDb, UpdateConfigCustomerDb } from "../valueobjects/config_custom.value";
export interface ConfigCustomerRepository {
  enableAllConfigCustomer():Promise<any>;
  enableOneConfigCustomerById(idConfigCustomer:number):Promise<ConfigCustomerData |null>;

  disableAllConfigsCustomers():Promise<any>;
  disableOneConfigCustomer(idConfigCustomer:number):Promise<ConfigCustomerData | null>;

  getAllConfigsCustomersAccordingStatus(status:number):Promise<ConfigCustomerData[] | null>;
  getAllConfigCustomer():Promise<ConfigCustomerData[] | null>;
  getConfigCustomer(idCustomer:number): Promise<ConfigCustomerDb | null>;

  createConfigCustomer(data:ConfigCustomerData): Promise <ConfigCustomerData |null>;

  updateConfigCustomer(idCustomer: number, payload: UpdateConfigCustomerDb);

  deleteAllConfigsCustomers():Promise<any>;
  deleteAllConfigsCustomersAccordingStatus(status:number):Promise<any>;
  deletePermanentConfigCustomer(idConfigCustomer:number):Promise<any>;

  deleteConfigCustomer(idCustomer: number);
}
