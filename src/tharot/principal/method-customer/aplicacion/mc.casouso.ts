import { McRepository } from "../dominio/repository/mc.repository";
import { McData, McUpdateData } from "../dominio/valueobject/mc.value";

export class McCasoUso {
  constructor(private readonly mcRepository: McRepository) {}

  async deleteAllMCs(idCustomer: number) {
    const response=await this.mcRepository.deleteAllMCs(idCustomer);
    if(response["affected"]===0){
      return {ok:false,status:204,message:"No existen registros"};
    }
    return {ok:true,status:200,message:"Registros eliminados con éxito"};
  }

  async getAllMcsByIdCustomer(idCustomer:number): Promise<McData[]> {
    return await this.mcRepository.getAllMcsByIdCustomer(idCustomer);
  }

  async getMethod(id: number) {
    const rol = await this.mcRepository.getMc(id);
    return rol;
  }
  
  async enableMC(id: number) {
    return this.mcRepository.enableMC(id);
  }

  async getAllMethods() {
    const rols = await this.mcRepository.getAllMcs();
    return rols;
  }

  async createMethod(data: McData) {
    const rol = await this.mcRepository.createMc(data);
    return rol;
  }

  async updateMethod(id: number, data: McUpdateData) {
    const rol = await this.mcRepository.updateMc(id, data);
    return rol;
  }
}
