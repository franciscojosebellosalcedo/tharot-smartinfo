import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { notificationRepository } from "../../dominio/repository/notification.repository";
import { NotificationData } from "../../dominio/valueObject/notification.value";
import { NotificationModel } from "../modelos/notification.model";
@Injectable()
export class NotificationService implements notificationRepository {
  constructor(@InjectRepository(NotificationModel) private _notificacionModel: Repository<NotificationModel>) { }

  async getAllNotificationsAccordingToTheStatus(idUser: number, status: number): Promise<NotificationData[]> {
    return await this._notificacionModel.find({where:{user_id:idUser, status:status}});
  }

  async deleteAllNotificationsAccordingToTheStatus(idUser: number, status: number): Promise<any> {
    return await this._notificacionModel.delete({user_id:idUser,status:status});
  }

  async getAllNotifications(): Promise<NotificationData[]> {
    return await this._notificacionModel.find();
  }

  async deleteAllNotificationByIdUser(idUser: number): Promise<any> {
    return await this._notificacionModel.delete({user_id:idUser});
  }
  
  async deleteNotificationById(idNotification: number): Promise<any>{
    return await this._notificacionModel.delete({id: idNotification});
  }
  
  async enableAllNotificationsByIdUser(idUser: number): Promise<NotificationData[]> {
    await this._notificacionModel.update({user_id:idUser},{status:1});
    return await this._notificacionModel.find({where:{user_id:idUser}});
  }
  
  async disableAllNotificationsByIdUser(idUser: number): Promise<NotificationData[]> {
    await this._notificacionModel.update({user_id:idUser},{status:0});
    return await this._notificacionModel.find({where:{user_id:idUser}});
  }

  async getOneNotificationUserByIdNoti(idNotification: number): Promise<NotificationData> {
    return await this._notificacionModel.findOne({where:{id:idNotification}});
  }

  async getAllNotificationUsers(idUser: number): Promise<NotificationData[]> {
    return await this._notificacionModel.find({where:{user_id: idUser}});
  }

  async disableNotificationUser(idNotification: number): Promise<NotificationData> {
    await this._notificacionModel.update(idNotification,{status:0});
    return await this._notificacionModel.findOne({where:{id:idNotification}});
  }

  async enableNotificationUser(idNotification: number): Promise<NotificationData> {
    await this._notificacionModel.update(idNotification,{status:1});
    return await this._notificacionModel.findOne({where:{id:idNotification}});
  }

  async createNotificationUser(body: NotificationData): Promise<NotificationData | null> {
    const notificationCreated = await this._notificacionModel.create(body);
    return await this._notificacionModel.save(notificationCreated);
  }

}