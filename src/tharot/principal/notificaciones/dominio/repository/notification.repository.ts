import { NotificationData } from "../valueObject/notification.value";

export interface notificationRepository{
    getAllNotificationsAccordingToTheStatus(idUser:number,status:number):Promise<NotificationData[] | null>;
    getAllNotifications():Promise<NotificationData[] | null>;
    getAllNotificationUsers(idUser:number):Promise<NotificationData[] | null>;
    getOneNotificationUserByIdNoti(idNotification:number):Promise<NotificationData | null>;

    deleteAllNotificationsAccordingToTheStatus(idUser:number,status:number):Promise<any>;
    deleteNotificationById(idNotification:number):Promise<any>;
    deleteAllNotificationByIdUser(idUser:number):Promise<any>;

    disableAllNotificationsByIdUser(idUser:number):Promise<NotificationData[] | null>;
    enableAllNotificationsByIdUser(idUser:number):Promise<NotificationData[] | null>;
    disableNotificationUser(idNotification:number):Promise<NotificationData | null>;
    enableNotificationUser(idNotification:number):Promise<NotificationData | null>;

    createNotificationUser(body:NotificationData):Promise<NotificationData | null>;
}