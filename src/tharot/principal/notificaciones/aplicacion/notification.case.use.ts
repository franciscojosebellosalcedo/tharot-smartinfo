import { UserRepository } from "../../user/dominio/repository/user.repositoty";
import { notificationRepository } from "../dominio/repository/notification.repository";
import { NotificationData } from "../dominio/valueObject/notification.value";

export class NotificationCaseUse {
  constructor(private notificationRepository: notificationRepository, private userRepository?: UserRepository) {
  }

  async getAllNotificationsAccordingToTheStatus(idUser: number, status: number) {
    const userFound = await this.userRepository.findUserById(idUser);
    if (!userFound) {
      return { ok: false, message: "Usuario no existente en la aplicación", status: 404, error: { message: "Usuario no registrado en la aplicación" } };
    }
    if (status < 0 || status > 1) {
      return { ok: false, status: 203, message: "Valor de status incorrecto debe ser 0 ó 1 (0 desactivado y 1 activo)" };
    }
    const notifications=await this.notificationRepository.getAllNotificationsAccordingToTheStatus(idUser, status);
    return {ok:true,status:200,message:"Notificaciones encontradas",datos:[...notifications]};
  }

  async deleteAllNotificationsAccordingToTheStatus(idUser: number, status: number) {
    const userFound = await this.userRepository.findUserById(idUser);
    if (!userFound) {
      return { ok: false, message: "Usuario no existente en la aplicación", status: 404, error: { message: "Usuario no registrado en la aplicación" } };
    }
    if (status < 0 || status > 1) {
      return { ok: false, status: 203, message: "Valor de status incorrecto debe ser 0 ó 1 (0 desactivado y 1 activo)" };
    }
    const responseDeletedNotifications=await this.notificationRepository.deleteAllNotificationsAccordingToTheStatus(idUser,status);
    if(responseDeletedNotifications["affected"]===0){
      return {ok:false,message:`No tienes notificaciones en este estado`,status:204};
    }
    return {ok:true,status:200,message:`Notificaciones eliminadas con exito`};

  }

  async getAllNotifications() {
    const notifications = await this.notificationRepository.getAllNotifications();
    if (notifications.length === 0) {
      return { ok: false, status: 204, message: "No hay notificaciones creadas en la aplicación" };
    }
    return { ok: true, status: 200, message: "Notificaciones encontradas", datos: [...notifications] };
  }

  async deleteAllNotificationByIdUser(idUser: number) {
    const userFound = await this.userRepository.findUserById(idUser);
    if (!userFound) {
      return { ok: false, status: 404, message: "Usuario no registrado en la aplicación", error: { message: "Este usuario no está registrado en la aplicación" } };
    }
    const responseDeleted = await this.notificationRepository.deleteAllNotificationByIdUser(idUser);
    if (responseDeleted["affected"] === 0) {
      return { ok: false, status: 204, message: "No tienes notificaciones", error: { message: "No se encontró ninguna notificación" } }
    }
    const responseNotifications = await this.getAllNotificationUsers(idUser);
    if (responseNotifications.ok === false) {
      return { ok: true, status: 200, message: "Notificaciones eliminadas con exito", datos: responseNotifications.datos };
    }
    return { ok: false, status: 200, message: "No tienes notificaciones", datos: responseNotifications.datos };
  }

  async deleteNotificationById(idNotification: number) {
    const notificationFound = await this.getOneNotificationUserByIdNoti(idNotification);
    const response = await this.notificationRepository.deleteNotificationById(idNotification);
    if (response["affected"] === 0) {
      return { ok: false, status: 204, message: "No se pudo eliminar la notificación", error: { message: "No se afectó la fila en la tabla de notificaciones (no elimino el registro)" } }
    }
    const listNotificationsByUser = await this.getAllNotificationUsers(notificationFound.datos.user_id);
    return { ok: true, status: 200, message: "Notificación eliminada con exito", datos: listNotificationsByUser };
  }

  async enableAllNotificationsByIdUser(idUser: number) {
    const userFound = await this.userRepository.findUserById(idUser);
    if (!userFound) {
      return { ok: false, status: 404, message: "Usuario no registrado en la aplicación", error: { message: "Este usuario no está registrado en la aplicación" } };
    }
    const listNotificationsDisabled = await this.notificationRepository.enableAllNotificationsByIdUser(idUser);
    if (listNotificationsDisabled.length === 0) {
      return { ok: false, status: 204, message: "No se activó ninguna notificación", error: { message: "no se activó ninguna notificación de la base de datos" } }
    }
    return { ok: true, status: 200, message: "Notificaciones activadas", datos: [...listNotificationsDisabled] };
  }

  async disableAllNotificationsByIdUser(idUser: number) {
    const userFound = await this.userRepository.findUserById(idUser);
    if (!userFound) {
      return { ok: false, status: 404, message: "Usuario no registrado en la aplicación", error: { message: "Este usuario no está registrado en la aplicación" } };
    }
    const listNotificationsDisabled = await this.notificationRepository.disableAllNotificationsByIdUser(idUser);
    if (listNotificationsDisabled.length === 0) {
      return { ok: false, status: 204, message: "No se desactivó ninguna notificación", error: { message: "no se desactivo ninguna notificación de la base de datos" } }
    }
    return { ok: true, status: 200, message: "Notificaciones desabilitadas", datos: [...listNotificationsDisabled] };
  }

  async getAllNotificationUsers(idUser: number) {
    const userFound = await this.userRepository.findUserById(idUser);
    if (!userFound) {
      return { ok: false, status: 404, message: "Usuario no registrado en la aplicación", error: { message: "Este usuario no está registrado en la aplicación" } };
    }
    const listNotifications = await this.notificationRepository.getAllNotificationUsers(idUser);
    if (listNotifications.length === 0) {
      return { ok: false, status: 204, message: "No se enontraron notificaciones de este usuario", datos: [...listNotifications], error: { message: "Este usuario no tiene notificaciones registradas en la base de datos" } };
    }
    return { ok: true, status: 200, message: "Lista de notificaciones", datos: [...listNotifications] };
  }

  async getOneNotificationUserByIdNoti(idNotification: number) {
    const notificationFound = await this.notificationRepository.getOneNotificationUserByIdNoti(idNotification);
    if (!notificationFound) {
      return { ok: false, status: 404, message: "Notificación no encontrada", error: { message: "Notificación no existente en la base de datos" } };
    }
    return { ok: true, status: 200, message: "Notificación encontrada", datos: { ...notificationFound } };
  }

  async disableNotificationUser(idNotification: number) {
    const notificationEnabled = await this.notificationRepository.disableNotificationUser(idNotification);
    if (!notificationEnabled) {
      return { ok: false, status: 404, message: "Notificación no encontrada" };
    }
    if (notificationEnabled.status === 1) {
      return { ok: false, status: 404, message: "Notificación no desactivada", error: { message: "No se pudo desactivar la notificacion (no cambió el status en la tabla)" } };
    }
    return { ok: true, status: 200, message: "Notificación desactivada con exito", datos: { ...notificationEnabled } };
  }

  async enableNotificationUser(idNotification: number) {
    const notificationEnabled = await this.notificationRepository.enableNotificationUser(idNotification);
    if (!notificationEnabled) {
      return { ok: false, status: 404, message: "Notificación no encontrada" };
    }
    if (notificationEnabled.status === 0) {
      return { ok: false, status: 404, message: "Notificación no activada", error: { message: "No se pudo activar la notificacion (no cambió el status en la tabla)" } };
    }
    return { ok: true, status: 200, message: "Notificación activada con exito", datos: { ...notificationEnabled } };
  }

  async createNotificationUser(body: NotificationData) {
    const userFound = await this.userRepository.findUserById(body.user_id);
    if (!userFound) {
      return { ok: false, status: 404, message: "Usuario no registrado en la aplicación", error: { message: "Este usuario no está registrado en la aplicación" } };
    }
    const responseNotificationSaved = await this.notificationRepository.createNotificationUser(body);
    if (!responseNotificationSaved) {
      return { ok: false, status: 204, message: "No se pudo agregar la notificación", error: { message: "no se pudo agregar la notificación a la base de datos" } };
    }
    return { ok: true, status: 200, message: "Notificación agregada con exito", datos: { ...responseNotificationSaved } };
  }

}