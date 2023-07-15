import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { sessionData } from "../../../user/dominio/entities/user.entity";
import { Repository } from "typeorm";
import { InterfaceSessionRepository } from "../../dominio/repository/session.repository";
import { SessionData } from "../../dominio/valueobject/session.value";
import { Session as sessionModel } from "../modelos/session.model";

@Injectable()
export class SessionService implements InterfaceSessionRepository {
  constructor(@InjectRepository(sessionModel) private readonly _session: Repository<sessionModel>) { }
  
  async getAllSessionsActivesByIdentity(identity: string): Promise<SessionData[]> {
    const listSessionActives = await this._session.find({ where: { user_id: identity, status: 1 } });
    return listSessionActives;
  }

  async updateIdentitySessionUser(identityUser: string, identityNew: string): Promise<boolean> {
    const sessionFound = await this._session.findOne({ where: { user_id: identityUser } });
    if (!sessionFound) {
      return false;
    }
    const session = await this._session.update({ user_id: identityUser }, { user_id: identityNew });
    if (session["affected"] === 0) {
      return false;
    }
    return true;
  }

  async saveChangeSession(session: SessionData): Promise<any> {
    if (!session) {
      return null;
    }
    return await this._session.save(session);
  }

  async getOneSessionByUserId(user_id: string, token: string): Promise<SessionData | null> {
    const sessionFound = await this._session.findOne({ where: { user_id: user_id, token: token } });
    return sessionFound;
  }

  async amountSessionActive(user_id: string) {
    const listSession = await this._session.find({ where: { user_id, status: 1 } });
    if (listSession.length === 0) {
      return {
        ok: false,
        message: "No se encontraron sesiones activas",
        error: {
          listSesions: listSession
        }
      }
    }
    return {
      listSession,
      amount: listSession.length
    }
  }

  async verifyNewSession(body: sessionData): Promise<any> {
    const sessions = await this._session.find();
  }

  async findAllSessionByIdUser(user_id: string): Promise<any> {
    const sessionsFound = await this._session.find({ where: { user_id: user_id } });
    if (sessionsFound.length === 0) {
      return null;
    }
    return sessionsFound;
  }

  async deleteSession(sessionId: number): Promise<any> {
    const sessionFound = await this._session.findOne({ where: { id: sessionId } });
    if (!sessionFound) {
      return {
        msg: "Sesión no encontrada", ok: false
      }
    }
    const sessionDeleted = await this._session.delete(sessionId);
    if (sessionDeleted["affected"] === 0) {
      return {
        msg: "No se pudo eliminar la sesión", ok: false
      }
    }
    return {
      msg: "Sesión eliminada con exito", ok: true
    }
  }

  async createSession(body: SessionData): Promise<SessionData | any> {
    //sessionFound almacena una sesion encontrada desde la base de datos en caso de que exista una sesion con el mismo id con el que se desea guardar la base de datos
    // findOne es un metodo que retorna el primer registro que encuntre en la base de datos dependiendo del id que reciba por parametro
    const sessionFound = await this._session.findOne({ where: { user_id: body.user_id, ip_device: body.ip_device } });
    //si existe un id hacemos otra condicion dentro
    if (sessionFound) {
      if (sessionFound.status === 1 && sessionFound.user_id === body.user_id && sessionFound.ip_device === body.ip_device) {
        return {
          message: "Ya tienes una sesion activa en este dispositivo",
          ok: false,
          status: 405,
          datos: { ...sessionFound }
        }
      } else if (sessionFound.status === 0 && sessionFound.user_id === body.user_id && sessionFound.ip_device === body.ip_device) {
        sessionFound.date_login = new Date();
        sessionFound.date_logout = null;
        sessionFound.token = body.token;
        sessionFound.status = 1;
        await this._session.save(sessionFound);
        return {
          ok: true,
          datos: { ...sessionFound },
          message: "Sesión iniciada correctamente",
          status: 200
        }
      }
    }

    //sessionCreated almacena la sesion que se esta creando, el metodo create crea un nuevo registro en la base de datos
    const sessionCreated = this._session.create(body);
    //save guarda en la base de datos el nuevo registro creado
    await this._session.save(sessionCreated)
    const response = {
      ok: true,
      datos: sessionCreated,
      status: 200,
      message: "Sesión iniciada correctamente"
    };
    return response;
  }

  async disableSession(sessionId: number): Promise<any> {
    //sessionFound almacena una sesion encontrada desde la base de datos en caso de que exista una sesion con el mismo id con el que se desea guardar la base de datos
    // findOne es un metodo que retorna el primer registro que encuntre en la base de datos dependiendo del id que reciba por parametro
    const sessionFound = await this._session.findOne({ where: { id: sessionId } });
    //si no existe la session retorna un mensaje de sesion no encontrada
    if (!sessionFound) {
      return {
        msg: "Esta sesión no se encuentra", ok: false
      }
    }
    //si el status de esa sesion está en 0 es porque ya está en un estado de desabilitado
    if (sessionFound.status === 0) {
      return {
        msg: "Esta sesión ya está desabilidada", ok: false
      }
    }
    //editamos el status (status 0), aqui ya estaria desabilitando el registro de la base de datos (sesion)
    sessionFound.status = 0;
    //el metodo save guarda los cambis efectuados
    this._session.save(sessionFound);
    return {
      msg: "La sesión fue desactivada con exito", ok: true, data: sessionFound
    };
  }

  async enableSession(sessionId: number): Promise<SessionData | any> {
    //sessionFound almacena una sesion encontrada en la base de datos dependiendo del sessionId que se le pase (number)
    const sessionFound = await this._session.findOne({ where: { id: sessionId } });
    //si no existe la session en la base de datos retorna un mensaje de sesion no encontrada
    if (!sessionFound) {
      return {
        msg: "Esta sesión no se encuentra", ok: false
      }
    }
    //en caso que el status de la sesion encontrada está en 1, retorna un mensaje de que ya la sesion esta activa
    if (sessionFound.status === 1) {
      return {
        msg: "Esta sesión ya esta activa", ok: false
      }
    }
    //si el status de la sesion encontrada está en 0 pasa a ser ahora a 1
    sessionFound.status = 1;
    //el metodo save guarda en la base de datos los cambios nuevos en el registro
    await this._session.save(sessionFound);
    //retorna mensaje de que la sesion fue activada
    return {
      msg: "Sesión activada con exito", ok: true, session: { ...sessionFound }
    }
  }

  async getAllSessionData(): Promise<SessionData[]> {
    //retorna las lista de registros de sesiones en la base de datos de tipo list [], (array)
    return await this._session.find();
  }

  async getSessionById(sessionId: number): Promise<SessionData> {
    //findOne , este metodo retorna un solo registro de la base de datos 
    return await this._session.findOne({ where: { id: sessionId } });
  }

}