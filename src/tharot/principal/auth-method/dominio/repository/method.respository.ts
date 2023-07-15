import { MethodData, UpdateMethod } from "../valueobject/method.value";
export interface MethodRepository {
  disableMethodById(idMethod:number):Promise<MethodData| null>;
  disableAllMethods():Promise<any>;
  deleteMethodById(idMethod:number):Promise<any>;
  deleteAllMetthosAccordingStatus(status:number):Promise<any>;
  deleteAllMethods():Promise<any>;
  getAllMethodsAccordingStatus(status:number):Promise<MethodData[] | null>;

  getMethod(id:number): Promise<MethodData | null>;
  getAllMethods(): Promise<MethodData[] | null>;
  createMethod(data:MethodData): Promise <MethodData>;
  updateMethod(id: number, payload: UpdateMethod);
  deleteMethod(id: number);
  validateMethods(listIdMethods:number[]) : Promise<any>;
  enableMethod(id: number):Promise<any >;
}
