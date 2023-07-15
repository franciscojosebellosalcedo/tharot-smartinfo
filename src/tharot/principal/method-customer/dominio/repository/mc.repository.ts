import { McData, McUpdateData } from "../valueobject/mc.value";
export interface McRepository {
  deleteAllMCs(idCustomer:number):Promise<any>;
  getMc(id:number): Promise<McData | null>;
  getAllMcs(): Promise<McData[] | null>;
  getAllMcsByIdCustomer(idCustomer:number): Promise<McData[] | null>;
  createMc(data:McData): Promise <McData>;
  updateMc(id: number, payload: McUpdateData);
  enableMC(id: number): Promise<{}>;
}
