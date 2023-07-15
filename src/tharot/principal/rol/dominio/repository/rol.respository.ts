import { RolData, UpdateRol } from "../valueobject/rol.value";
export interface RolRepository {
  getAllRolAccordingStatus(status:number):Promise<RolData[] | null>;
  getRol(id:number): Promise<RolData | null>;
  getAllRols(): Promise<RolData[] | null>;

  deleteRolById(idRol:number):Promise<any>;
  deleteAllRolsAccordingStatus(status:number):Promise<any>;
  deleteAllRols(): Promise<any>;
  deleteRol(id:number):Promise<any>; 
  
  disableAllRols():Promise<any>;
  disableRolById(idRol:number):Promise<RolData| null>;
  
  createRol(data:RolData): Promise <RolData | any>  ;
  updateRol(id: number, payload: UpdateRol);

  enableRol(id:number):Promise<boolean>;
  enableAllRols():Promise<any>;
}
