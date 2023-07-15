import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {widgetRepository } from '../../dominio/repository/dashboard.repository';
import { ChangeIdColumnOfTheWidgetData, ChangeIdColumnOfTheWidgetFirstTimeData, WidgetData } from '../../dominio/valueObjet/dashboard.value';
import { WidgetModel } from '../modelos/widget.model';

@Injectable()
export class WidgetService implements widgetRepository {
  constructor(
    @InjectRepository(WidgetModel) private _widget: Repository<WidgetModel>
  ) {}

  async deleteAllWidgetAccordingToTheStatus(idColumn:number,status: number): Promise<any> {
    return await this._widget.delete({column_id:idColumn,status:status});
  }

  async deleteWidgetById(idWidget: number): Promise<any> {
    return await this._widget.delete({id:idWidget});
  }

  async getAllWidgetAccordingToTheStatus(idColumn:number,status:number): Promise<WidgetData[]> {
    return await this._widget.find({where:{column_id:idColumn,status:status}});
  }
  
  async changeColumnWidgetFirstTime(body: ChangeIdColumnOfTheWidgetFirstTimeData): Promise<WidgetData> {
    await this._widget.update({id:body.idWidget},{column_id:body.idColumn});
    return await this._widget.findOne({where:{id:body.idWidget}});
  }
  
  async enablebleWidgetById(idWidget: number): Promise<WidgetData> {
    await this._widget.update({id:idWidget},{status:1});
    return await this._widget.findOne({where:{id:idWidget}});
  }

  async disableWidgetById(idWidget: number): Promise<WidgetData> {
    await this._widget.update({id:idWidget},{status:0});
    return await this._widget.findOne({where:{id:idWidget}});
  }

  async changeStatusWidget(idWidget: number, newStatus: number):Promise<WidgetData | null> {
    await this._widget.update({id:idWidget},{status: newStatus});
    return await this._widget.findOne({where:{id:idWidget}});
  }

  async getWidgetById(idWidget: number): Promise<WidgetData> {
    return await this._widget.findOne({where:{id:idWidget}});
  }

  async changeColumnWidget(body:ChangeIdColumnOfTheWidgetData): Promise<WidgetData> {
    await this._widget.update(body.idWidget,{column_id:body.newIdColumn});
    return this._widget.findOne({where:{id:body.idWidget}});
  }

  async getAllWidgets(): Promise<WidgetData[]> {
    return await this._widget.find();
  }
  
  async getWidgetByIdColumn(idColumn: number): Promise<WidgetData> {
    return await this._widget.findOne({where:{column_id: idColumn}});
  }

  async getAllWidgetByIdColumn(idColumn: number): Promise<WidgetData[]> {
    return await this._widget.find({where:{column_id: idColumn}});
  }

  async addWidget(widget: WidgetData): Promise<WidgetData> {
    const widgetCreated=await this._widget.create(widget);
    return await this._widget.save(widgetCreated);
  }
  

}
