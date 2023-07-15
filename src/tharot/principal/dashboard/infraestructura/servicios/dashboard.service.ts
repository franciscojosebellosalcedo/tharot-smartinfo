import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { dashboardRepository } from '../../dominio/repository/dashboard.repository';
import { DashboardData } from '../../dominio/valueObjet/dashboard.value';
import { DashboardModel } from '../modelos/dashboard.model';

@Injectable()
export class DashboardService implements dashboardRepository {
  constructor(
    @InjectRepository(DashboardModel) private _dashboard: Repository<DashboardModel>
  ) {}

  async getAllDashboardsAccordingToTheStatus(idUser: number, status: number): Promise<DashboardData[]> {
    return await this._dashboard.find({where:{user_id:idUser,status:status}});
  }

  async deleteAllDashboardsAccordingToTheStatus(idUser:number,status: number): Promise<any> {
    return await this._dashboard.delete({user_id:idUser,status:status});
  }

  async deleteAllDashboardsByIdUser(idUser: number): Promise<any> {
    return await this._dashboard.delete({user_id:idUser});
  }

  async deleteDashboardById(idDashboard: number): Promise<any> {
    return await this._dashboard.delete({id: idDashboard});
  }

  async getOnlyAllDashboard(): Promise<DashboardData[]> {
    return await this._dashboard.find();
  }

  async getAllDataDashboards():Promise<DashboardData[] | null> {
    return await this._dashboard.find();
  }

  async getDashboardById(idDashboard: number): Promise<DashboardData> {
    return await this._dashboard.findOne({where:{id: idDashboard}});
  }

  async enableDashboard(idDashboard: number): Promise<DashboardData> {
    await this._dashboard.update(idDashboard,{status:1});
    const dashboard=await this._dashboard.findOne({where:{id:idDashboard}});
    return dashboard;
  }
  
  async getAllDashboardByIdUser(idUser: number): Promise<DashboardData[] | null> {
    return await this._dashboard.find({where:{user_id: idUser}});
  }
  
  async disableDashboard(idDashboard: number): Promise<DashboardData> {
    await this._dashboard.update(idDashboard,{status:0});
    const dashboard=await this._dashboard.findOne({where:{id:idDashboard}});
    return dashboard;
  }

  async createDashboard(body: DashboardData): Promise<DashboardData> {
    const {columns,...dashboard}=body;
    const dashboardCreated=await this._dashboard.create(dashboard);
    return await this._dashboard.save(dashboardCreated);
  }

}
