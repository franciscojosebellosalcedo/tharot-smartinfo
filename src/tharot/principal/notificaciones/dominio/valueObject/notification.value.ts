import { notificationEntity } from "../entities/notification.entity";
import { v4 as uuid } from "uuid";

export class NotificationData implements notificationEntity {
    id?: number;
    user_id: number;
    title: string;
    description: string;
    type_notification: string;
    status?: number;

    constructor({
        user_id,
        title,
        description,
        type_notification,
    }: {
        user_id: number;
        title: string;
        description: string;
        type_notification: string;
    }) {
        this.id=uuid();
        this.user_id=user_id;
        this.title=title;
        this.description=description;
        this.type_notification=type_notification;
        this.status=1;
    }
}