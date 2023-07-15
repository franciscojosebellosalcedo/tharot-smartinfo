import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../../../../../global/dominio/guards/jwt.guard";
import { ApiTags } from "@nestjs/swagger";
import { NotificationService } from "../servicios/notification.service";
import { NotificationCaseUse } from "../../aplicacion/notification.case.use";
import { CreateNotificationDto } from "../dtos/notification.dto";
import { UserService } from "../../../user/infraestructura/servicios/user.service";

@UseGuards(JwtAuthGuard)
@ApiTags("Notifications (notificaciones del usuario)")
@Controller("notification")
export class NotificationController {
  private notificationCaseUse: NotificationCaseUse;

  constructor(private readonly notificationService: NotificationService, private readonly userService?: UserService) {
    this.notificationCaseUse = new NotificationCaseUse(this.notificationService, this.userService);
  }

  @Get("allNotifications/according-to-the-status/:idUser/:status")
  async getAllNotificationsAccordingToTheStatus(@Param() param){
    return await this.notificationCaseUse.getAllNotificationsAccordingToTheStatus(parseInt(param.idUser),parseInt(param.status));
  }

  @Delete("deleteAll-according-to-the-status/:idUser/:status")
  async deleteAllNotificationsAccordingToTheStatus(@Param() param){
    return await this.notificationCaseUse.deleteAllNotificationsAccordingToTheStatus(parseInt(param.idUser),parseInt(param.status));
  }

  @Get("all")
  async getAllNotifications() {
    return await this.notificationCaseUse.getAllNotifications();
  }

  @Delete("delete-all-byIdUser/:idUser")
  async deleteAllNotificationByIdUser(@Param() param) {
    return await this.notificationCaseUse.deleteAllNotificationByIdUser(parseInt(param.idUser));
  }

  @Delete("delete/:idNotification")
  async deleteNotificationById(@Param() param) {
    return await this.notificationCaseUse.deleteNotificationById(parseInt(param.idNotification));
  }

  @Get("all-notifications-byUser/:idUser")
  async getAllNotificationUsers(@Param() param) {
    return await this.notificationCaseUse.getAllNotificationUsers(parseInt(param.idUser));
  }

  @Get(":idNotification")
  async getOneNotificationUserByIdNoti(@Param() param) {
    return await this.notificationCaseUse.getOneNotificationUserByIdNoti(parseInt(param.idNotification));
  }

  @Patch("enable-all-byUser/:idUser")
  async enableAllNotificationsByIdUser(@Param() param) {
    return await this.notificationCaseUse.enableAllNotificationsByIdUser(parseInt(param.idUser));
  }

  @Patch("disable-all-byUser/:idUser")
  async disableAllNotificationsByIdUser(@Param() param) {
    return await this.notificationCaseUse.disableAllNotificationsByIdUser(parseInt(param.idUser));
  }

  @Patch("disable/:idNotification")
  async disableNotificationUser(@Param() param) {
    return await this.notificationCaseUse.disableNotificationUser(parseInt(param.idNotification));
  }

  @Patch("enable/:idNotification")
  async enableNotificationUser(@Param() param) {
    return await this.notificationCaseUse.enableNotificationUser(parseInt(param.idNotification));
  }

  @Post()
  async createNotificationUser(@Body() Body: CreateNotificationDto) {
    return await this.notificationCaseUse.createNotificationUser(Body);
  }

}
