import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { columnRepository } from '../../dominio/repository/dashboard.repository';
import { ColumnData } from '../../dominio/valueObjet/dashboard.value';
import { ColumnModel } from '../modelos/column.model';

@Injectable()
export class ColumnService implements columnRepository {
  constructor(
    @InjectRepository(ColumnModel) private _column: Repository<ColumnModel>
  ) {}

  async deleteAllColumnsAccordingToStatus(idDashboard:number,status: number): Promise<any> {
    return await this._column.delete({dashboard_id:idDashboard,status:status});
  }

  async getAllColumnsAccordingToTheStatus(idDashboard:number,status:number): Promise<ColumnData[]> {
    return await this._column.find({where:{dashboard_id:idDashboard,status:status}});
  }

  async getAllColumns(): Promise<ColumnData[]> {
    return await this._column.find();
  }
  
  async deleteColumnById(idColumn: number): Promise<any> {
    return await this._column.delete({id: idColumn});
  }

  async deleteAllColumnByIdDashboard(idDashboard: number): Promise<any> {
    return await this._column.delete({dashboard_id: idDashboard});
  }

  async getColumnById(idColumn: number): Promise<ColumnData> {
    return await this._column.findOne({where:{id: idColumn}});
  }

  async enableColumn(idColumn: number): Promise<ColumnData> {
    await this._column.update(idColumn,{status:1});
    return this._column.findOne({where:{id:idColumn}});
  }

  async disableColumn(idColumn: number): Promise<ColumnData> {
    await this._column.update(idColumn,{status:0});
    return this._column.findOne({where:{id:idColumn}});
  }

  async getAllColumnByIdDashboard(idDashboard: number): Promise<ColumnData[]> {
    return await this._column.find({where:{dashboard_id: idDashboard}});
  }

  async createColumn(column: ColumnData): Promise<ColumnData> {
    const columnCreated=await this._column.create(column);
    return await this._column.save(columnCreated);
  }
  
}