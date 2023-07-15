import { sessionData } from "../../../user/dominio/entities/user.entity";
import { SessionData} from "../valueobject/session.value";
export interface InterfaceSessionRepository{
    getAllSessionsActivesByIdentity(identity: string): Promise<SessionData[] | null>;
    updateIdentitySessionUser(identityUser:string,identityNew:string):Promise<boolean>;
    createSession(body:SessionData):Promise<SessionData | any>;
    disableSession(sessionId:number):Promise<any>;
    deleteSession(sessionId:number):Promise<any>;
    enableSession(sessionId:number):Promise<SessionData | null>
    getAllSessionData():Promise<SessionData[] | null>
    getSessionById(sessionId:number):Promise<SessionData | null>;
    findAllSessionByIdUser(sessionId:string):Promise<SessionData[] | any>;
    verifyNewSession(body: sessionData):Promise<any>;
    amountSessionActive(user_id:string);
    getOneSessionByUserId(identity:string,token:string):Promise<SessionData | null>;
    saveChangeSession(session:SessionData):Promise<any>;
}