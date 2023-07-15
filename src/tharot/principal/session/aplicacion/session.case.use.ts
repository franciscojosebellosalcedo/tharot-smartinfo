import { sessionData } from "../../user/dominio/entities/user.entity";
import { InterfaceSessionRepository } from "../dominio/repository/session.repository";
import { SessionData } from "../dominio/valueobject/session.value";

export class SessionCaseUse {
  constructor(private readonly sessionRepository: InterfaceSessionRepository) { }

  async getAllSessionsActivesByIdentity(identity: string): Promise<SessionData[]> {
    if(!identity){
      return null;
    }
    return await this.sessionRepository.getAllSessionsActivesByIdentity(identity);
  }

  async updateIdentitySessionUser(identityUser:string,identityNew:string){
    return await this.sessionRepository.updateIdentitySessionUser(identityUser,identityNew);
  }

  async getOneSessionByUserId(user_id: string, token: string) {
    //retorna la sesión obtenida despues de la ejecucion del metodo
    return await this.sessionRepository.getOneSessionByUserId(user_id, token);
  }

  async saveChangeSession(session: SessionData) {
    //retorna la session ya con los cambios modificados, y si vemos en la base de datos los cambios se reflejan 
    return this.sessionRepository.saveChangeSession(session);
  }

  async verifyNewSession(body: sessionData) {
    return await this.sessionRepository.verifyNewSession(body);
  }

  async createSession(body: SessionData): Promise<SessionData | any> {
    //sessionCreated almacena la respuesta que da this.sessionRepository.createSession(body) la respuesta es un msg (mensaje) y un ok (false o true)
    const sessionCreated = await this.sessionRepository.createSession(body);
    //condicionamos si el ok es false fue porque no se pudo crear la session y retorna un objeto con un msg (mensaje) y un ok (false o true)
    if (sessionCreated.ok === false) {
      return {
        msg: sessionCreated.msg, ok: false, session: {...sessionCreated}
      }
    }
    //si no entra en la condicion anterior creará la session sin ningun problema
    return {
      msg: "Sesión creada con exito", ok: true, session: {...sessionCreated}
    }
  }

  async findAllSessionByIdUser(user_id: string) {
    //retorna todas las sessiones de un usuario en especifico ejecutando la funcion desde el repository de session (findAllSessionByIdUser(user_id))
    return this.sessionRepository.findAllSessionByIdUser(user_id);
  }

  async amountSessionUserActive(user_id: string) {
    //sessionsFound almacena lo que retorna la funcion this.sessionRepository.amountSessionActive(user_id), esta funcion devuelve el numero de las sessiones activas
    const sessionsFound = await this.sessionRepository.amountSessionActive(user_id);
    //si la cantidad de sessiones es igual a 3 el usuario no podrá crear mas sessiones en otros dispositivos
    if (sessionsFound === 3) {
      //retorna un objeto con tres propiedades, msg (mensaje), ok (true o false) y sessionsActives (numerico, almacena la cantidad de sessiones activas de usuario, por ejemplo 2)
      return {
        msg: "Ya no puedes crear mas sesiones en otros dispositivos, puedes cerrar sesion en otro dispositivos",
        ok: false,
        sessionsActives: sessionsFound
      }
    }
    // si la cantidad de sesiones es menor a 3 si podrá crear mas sesiones , y retornamos el mismo objeto con los mismos atributos
    return {
      msg: "Este  usuario puede tener mas sesiones", ok: true, sessionsActives: sessionsFound
    };
  }

  async deleteSession(sessionId: number) {
    //retorna el resultado de retorno de la ejecucion de esta funcion desde el repository de session this.sessionRepository.deleteSession(sessionId);
    return this.sessionRepository.deleteSession(sessionId);
  }

  async getAllSessionData() {
    //sessionData almacena todas las sesiones de todos los usuarios cuando se ejecuta la funcion desde el repository de session  this.sessionRepository.getAllSessionData();
    const sessionData = await this.sessionRepository.getAllSessionData();
    //si sessionData (array o list) está vacio (length=0) retorna un objeto con  un msg (mensaje) ok (true o false) y data (todas las sesiones encontradas en la base de datos) en este caso estara vacio
    if (sessionData.length === 0) {
      return {
        msg: "No se encontró ninguna sesión", ok: false, data: sessionData
      }
    }
    //si no entró en la condicion anterior retornará todas las sesiones que estan registradas en la base de datos
    return sessionData;
  }

  async getSessionById(sessionId: number) {
    //sessionFound almacena el resultado de la ejecucion de la funcion desde el repository de session this.sessionRepository.getSessionById(sessionId);
    const sessionFound = await this.sessionRepository.getSessionById(sessionId);
    //si la sessionno existe retorna un objeto con dos propiedades , msg(mensaje-texto) y ok (false o true)
    if (!sessionFound) {
      return {
        msg: "Sesión no encontrada", ok: false
      }
    }
    //si la session si existe en la base de datos se retorna
    return sessionFound;
  }

  async disableSession(sessionId: number) {
    //retorna el resultado de la ejecución de la funcion que esta siendo llamada desde el repository de sessiones this.sessionRepository.disableSession(sessionId);
    return await this.sessionRepository.disableSession(sessionId);
  }

  async enableSession(sessionId: number) {
    //retorna el resultado de la ejecución de la funcion que esta siendo llamada desde el repository de sessiones this.sessionRepository.enableSession(sessionId);
    return await this.sessionRepository.enableSession(sessionId);
  }
}