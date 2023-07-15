import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthRepository } from '../../dominio/repository/user.repositoty';
import {
  AuthData, ChangePasswordData, ChangePasswordTirstTimeData,
  DeleteCodeVerificationData, LogoutData, MethodTwoPassLoginData,
  UseCodeVerificationData, UserData, ValidateChangePasswordUser,
  ValidateCodeVerifyData, VerifyExistAccontUserData
} from "../../dominio/valueobject/user.value";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Auth as authModel } from '../modelos/auth.model';
import { User as userModel} from '../modelos/user.model';
import {CreateVerifyCodeDto } from '../dtos/user.dto';
import { UserService } from "./user.service";
import { verify, sign } from 'jsonwebtoken';
import { UserCasoUso } from '../../aplicacion/user.caso';
import { VerifyCode } from '../modelos/verify_code.model';
import { transporter } from '../../../../../config';
import { verifyCode } from '../../dominio/entities/user.entity';
import { RolCasoUso } from '../../../rol/aplicacion/rol.casouso';
import { RolService } from '../../../rol/infraestructura/servicios/rol.service';
import { SessionCaseUse } from '../../../session/aplicacion/session.case.use';
import { SessionService } from '../../../session/infraestructura/servicios/session.service';
import { SessionData } from '../../../session/dominio/valueobject/session.value';
import { CustomersService } from '../../../customers/infraestructura/servicios/customer.service';
import { CustomersCaseUse } from '../../../customers/aplicacion/customers.case.use';
import { MethodService } from '../../../auth-method/infraestructura/servicios/method.service';
import { McService } from '../../../method-customer/infraestructura/servicios/mc.service';
import { MethodCasoUso } from '../../../auth-method/aplicacion/method.casouso';
import { McCasoUso } from '../../../method-customer/aplicacion/mc.casouso';
import { McData } from '../../../method-customer/dominio/valueobject/mc.value';

//servicio de Auth (autencticacion de usuario)
@Injectable()
export class AuthService implements AuthRepository {
  private userCaseUse: UserCasoUso;
  private rolCaseUse: RolCasoUso;
  private sessionCaseUse: SessionCaseUse;
  private customerCaseUse: CustomersCaseUse;
  private methodCaseUse: MethodCasoUso;
  private mcCaseUse: McCasoUso;

  constructor(
    @InjectRepository(authModel) private _auth: Repository<authModel>,
    @InjectRepository(userModel) private _user: Repository<userModel>,
    @InjectRepository(VerifyCode) private _verifyCode: Repository<VerifyCode>,
    private userService: UserService,
    private rolService: RolService,
    private customerService: CustomersService,
    private sessionService: SessionService,
    private methodService: MethodService,
    private mcService: McService
  ) {
    this.customerCaseUse = new CustomersCaseUse(this.customerService);
    this.methodCaseUse = new MethodCasoUso(this.methodService);
    this.mcCaseUse = new McCasoUso(this.mcService);

    this.userCaseUse = new UserCasoUso(this.userService);
    this.rolCaseUse = new RolCasoUso(this.rolService);
    this.sessionCaseUse = new SessionCaseUse(this.sessionService);
  }

  async getAuthUserByAuthenticatorAscii(ascii: string): Promise<AuthData> {
    return await this._auth.findOneBy({authenticator_ascii:ascii});
  }

  async getAuthByEmail(email: string): Promise<AuthData> {
    return await this._auth.findOneBy({email:email});
  }

  async saveChangesAuthUser(auth: AuthData) {
    await this._auth.save(auth);
  }

  async getAllAuthUser(): Promise<AuthData[]> {
    return await this._auth.find();
  }

  async getMethodsAvailableUserCustomers(body: VerifyExistAccontUserData) {
    const authUserFound = await this._auth.findOne({ where: { email: body.email } });
    if (!authUserFound) {
      return 1;
    }
    const userFound = await this.userCaseUse.getOneUser(authUserFound.user_identity);
    if (!userFound) {
      return 2;
    }
    if (userFound.status === 0 || authUserFound.status === 0) {
      return 3;
    }
    if (userFound.change_password === 0) {
      return 4;
    }
    const customerUserFound = await this.customerCaseUse.getCustomerById(userFound.customer_id);
    if (!customerUserFound) {
      return 5;
    }
    const listMethodsFoundByCustomer = [];
    const listMethodsCustomer = await this.mcCaseUse.getAllMcsByIdCustomer(customerUserFound.id);
    await Promise.all(listMethodsCustomer.map(async (mc: McData) => {
      const method = await this.methodCaseUse.getMethod(mc.method_id);
      listMethodsFoundByCustomer.push(method);
    }));
    if (listMethodsFoundByCustomer.length === 0) {
      return 6;
    }
    return {
      datos: [...listMethodsFoundByCustomer],
      customer_id: customerUserFound.id,
      name_customer: customerUserFound.name
    }
  }


  async updateIdentityAuthUser(identityUser: string, identityNew: string): Promise<boolean> {
    const authUserFound = await this._auth.findOne({ where: { user_identity: identityUser } });
    if (!authUserFound) {
      return false;
    }
    authUserFound.user_identity = identityNew;
    const authUpdated = await this._auth.save(authUserFound);
    if (!authUpdated) {
      return false
    }
    return true;
  }

  async updateEmailCodeVerificationByEmail(emailUser: string, emailNewUser: string): Promise<boolean> {
    const codeVerificationFound = await this._verifyCode.findOne({ where: { email_auth: emailUser } });
    if (!codeVerificationFound) {
      return false;
    }
    codeVerificationFound.email_auth = emailNewUser;
    const codeUpdate = await this._verifyCode.save(codeVerificationFound);
    if (!codeUpdate) {
      return false;
    }
    return true;
  }

  async validateChangePasswordUser(body: ValidateChangePasswordUser) {
    if (!body.email) {
      return {
        message: "Por favor verifique que se este enviando el correo correctamente", ok: false, status: 404, error: { message: "El correo que se está enviando llega vacio" }
      }
    }
    const authUser = await this._auth.findOne({ where: { email: body.email } });
    if (!authUser) {
      return {
        message: "Por favor verifique sus credenciales", ok: false, status: 404, error: { message: "No se encuentra el registro de auth de este correo" }
      }
    }
    const userFound = await this.userCaseUse.getOneUser(authUser.user_identity);
    if (!userFound) {
      return {
        message: "Por favor verifique sus credenciales", ok: false, status: 404, error: { message: "Este usuario no está en la base de datos" }
      }
    }
    return await this.userService.validateChangePassword(userFound);
  }

  async enabledAuthUser(user: UserData) {
    if (!user) {
      return {
        message: "Usuario no encontrado",
        ok: false,
        status: 404,
        error: {
          message: "Este usuario no se encuentra en la aplicación"
        }
      }
    }
    const auth = await this._auth.findOne({where:{user_identity:user.identity}});
    if (!auth) {
      return {
        message: "(auth) de Usuario no encontrada",
        ok: false,
        status: 404,
        error: {
          message: "Auth no encontrada"
        }
      }
    }
    auth.status = 1;
    return await this._auth.save(auth);
  }

  async deleteAuthUser(user: UserData) {
    if (!user) {
      return {
        message: "Usuario no encontrado",
        ok: false,
        status: 404,
        error: {
          message: "Este usuario no se encuentra en la aplicación"
        }
      }
    }
    const auth = await this._auth.findOne({where:{user_identity:user.identity}});
    if (!auth) {
      return {
        message: "(auth) de Usuario no encontradas",
        ok: false,
        status: 404,
        error: {
          message: "Auth no encontrada"
        }
      }
    }
    auth.status = 0;
    return await this._auth.save(auth);
  }

  async methodTwoPassLogin(body: MethodTwoPassLoginData): Promise<any> {
    const auth = await this._auth.findOne({ where: { email: body.email } });
    if (!auth) {
      return {
        msg: "Verifique sus datos por favor", ok: false, twoPass: false
      }
    }
    const validationUser = await this.validate(body.email, body.password);
    if (validationUser === true) {
      const user = await this.userCaseUse.getOneUser(auth.user_identity);
      if (!user) {
        return {
          msg: "Verifique sus datos por favor", ok: false, twoPass: false
        }
      }
      const listSessionUsers = await this.sessionCaseUse.findAllSessionByIdUser(user.identity);
      if (!listSessionUsers) {
        return {
          ok: false, msg: "No se encontraron sesiones"
        }
      }
      if (listSessionUsers.length > 0) {
        const validateIpDevice = listSessionUsers.find((session: SessionData) => session.ip_device === body.ip_device);
        if (!validateIpDevice) {
          const rol = await this.rolCaseUse.getRol(user.rol_id);
          const token = sign({ user, email: auth.email, rol_level: rol.datos.level }, process.env.SECRET_KEY, { algorithm: "HS256" });
          return {
            msg: "Por seguridad debes realizar el metodo dos pasos para iniciar sesión en otro dispositivo, se realizó un envio de un codigo de verificación a su correo electrónico", ok: true, data: token
          }
        }
        return {
          msg: "Hay una session  con esta ip de dispositivo (esta session se activará)", ok: false, twoPass: false
        }
      }
    }
    return {
      msg: "Verifique sus datos por favor", ok: false, twoPass: false
    }
  }

  async logout(body: LogoutData) {
    const sessionActive = await this.sessionCaseUse.getOneSessionByUserId(body.user_identity, body.token);
    if (!sessionActive) {
      return {
        message: "No se encontró la sesion",
        ok: false,
        status: 404,
        error: new NotFoundException()
      }
    }
    if (sessionActive.status === 1 && sessionActive.token === body.token && sessionActive.user_id === body.user_identity) {
      sessionActive.status = 0;
      sessionActive.date_logout = new Date();
      this.sessionCaseUse.saveChangeSession(sessionActive);
      const authUser = await this._auth.findOne({ where: { user_identity: body.user_identity } });
      if (!authUser) {
        return {
          message: "No se enocotraron credenciales",
          ok: false,
          status: 404,
          error: new NotFoundException()
        }
      }
      const user = await this.userCaseUse.getOneUser(authUser.user_identity);
      if (!user) {
        return {
          message: "No se encontró usuario",
          ok: false,
          status: 404,
          error: new NotFoundException()
        }
      }
      this.userCaseUse.decrementSessionUserActive(user.uid);
      authUser.authenticator_status=0;
      await this.saveChangesAuthUser(authUser);
      return {
        message: "Sesión cerrada con exito",
        ok: true,
        status: 200,
        datos: sessionActive
      }

    } else if (sessionActive.status === 0) {
      return {
        message: "No se pudo cerrar la sesion",
        ok: false,
        status: 405,
        error: {
          message: "Error al cerrar la sesion"
        }
      }
    }
    return {
      message: "Hubo un error al intentar cerrar la sesion",
      ok: false,
      status: 404,
      error: { message: "Los datos que se están ingresando no son los correctos para cerrar esta sesion" }
    }

  }

  async getOneAuthUserByUserEmail(email: string): Promise<any> {
    if (!email || email.length === 0) {
      return {
        ok: false
      }
    }
    const authUser = await this._auth.findOne({ where: { email: email } });
    if (!authUser) {
      return {
        ok: false
      };
    }
    const user = await this.userCaseUse.getOneUser(authUser.user_identity);
    const token = sign(
      {
        user: { ...user }
      }
      , process.env.SECRET_KEY, { algorithm: "HS256" });
    return {
      ok: true, data: token
    }
  }

  async changePassword(body: ChangePasswordData): Promise<any> {
    if (body.password_last.length < 8) {
      return {
        ok: false,
        message: "La contraseña actual debe de tener minimo 8 caracteres",
        status: 200,
        error: {
          message: "Cantidad de caracteres incorrecta"
        }
      }
    }
    if (body.password_new.length < 8) {
      return {
        ok: false,
        message: "La contraseña nueva debe de tener minimo 8 caracteres",
        status: 200,
        error: {
          message: "Cantidad de caracteres incorrecta"
        }
      }
    }
    const user = await this.userCaseUse.getOneUser(body.identity);
    if (user && user.change_password === 0) {
      return {
        ok: false,
        message: "Primero debes de asignar tu contraseña",
        status: 200,
        error: {
          message: "Este usuario no ha asignado su contraseña"
        }
      }
    }
    const customerFound=await this.customerCaseUse.getCustomerBy_Id(user.customer_id);
    if(!customerFound){
      return {ok:false,status:404,message:"Este usuario no pertenece a una empresa"};
    }else if(customerFound.status===0){
      return {ok:false,status:203,message:"La empresa a la que perteneces actualmente está deshabilitada, por lo tanto no podrás ingresar a la aplicación"};
    }

    const auth = await this._auth.findOne({ where: { user_identity: body.identity } });
    if (!user || !auth) {
      return {
        message: "Este usuario no se encuentra en la aplicación", ok: false, status: 404
      }
    }else if(user.status===0 || auth.status===0){
      return {ok:false,status:203,message:"Usuario actualmente deshabilitado, por lo tanto no podrás ingresar a la aplicación"};
    }

    const comparePasswordLast = await bcrypt.compare(body.password_last, auth.password);
    if (comparePasswordLast === false) {
      return {
        message: "La contraseña actual es incorrecta", ok: false, status: 204
      }
    }
    const comparePasswordNew = await bcrypt.compare(body.password_new, auth.change_password_last);
    if (comparePasswordNew === true) {
      return {
        message: "Escriba una contraseña que no haya utilizado anteriormente", ok: false, status: 204
      }
    }
    const otherComparePasswordNew = await bcrypt.compare(body.password_new, auth.password);

    if (otherComparePasswordNew === true) {
      return {
        message: "Escriba una contraseña que no haya utilizado anteriormente", ok: false, status: 204
      }
    }
    if (user.change_password === 0) {
      return {
        message: "Primero debes de terminar la configuración de tu cuenta, revise su correo electrónico", ok: false, status: 204
      }
    }
    const requiredCharacters = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+|~\-=`{}[\]:";'<>?,./])(?!.*\s).{8,}$/;
    if (requiredCharacters.test(body.password_new) === false) {
      return {
        message: "La contraseña debe contener caracteres en mayúscula, números y algún caracter especial ($,@,%)", ok: false, status: 200
      }
    }
    const passwordNewHash = await bcrypt.hash(body.password_new, 10);
    auth.change_password_date = new Date();
    auth.change_password_last = auth.password;
    user.change_password = 1;
    auth.password = passwordNewHash;
    await this._auth.save(auth);
    await this._user.save(user);
    return {
      message: "Contraseña actualizada con exito", ok: true, status: 200
    }
  }

  async updateEmailAuthUseByIdentity(identityUser: string, emailNew: string): Promise<any> {
    const authUserFound = await this._auth.findOne({ where: { user_identity: identityUser } });
    authUserFound.email = emailNew;
    authUserFound.updatedAt = new Date();
    return this._auth.save(authUserFound);
  }

  async getOneAuthUser(email: string): Promise<any> {
    const authUserFound = await this._auth.findOne({ where: { email: email } });
    return authUserFound;
  }
  async getOneAuthUserByUserIdendity(userIdentity: string): Promise<any> {
    const authUserFound = await this._auth.findOne({ where: { user_identity: userIdentity } });
    return authUserFound;
  }

  async changePasswordTirstTime(body: ChangePasswordTirstTimeData) {
    if (body.password_new.length < 8) {
      return {
        ok: false,
        message: "La contraseña debe de tener minimo 8 caracteres",
        status: 200,
        error: {
          message: "Cantidad de caracteres incorrecta"
        }
      }
    }
    //authFound almacena el registro encontrado con el email del objeto body, este registro viene desde la base de datos
    const authFound = await this._auth.findOne({ where: { email: body.email } });
    //verificacion de existencia de ese registro
    if (!authFound) {
      //en caso de que no exista retorna un objeto tipo informativo de no encontrado, propiedades: msg es el mensaje y ok en false
      return {
        message: "No se encontró usuario con este correo electrónico",
        ok: false,
        status: 404,
        error: {
          message: "No se encuentran las credenciales de este usuario"
        }
      }
    }
    //userFound almacena el usuario que se encuentra en la base de datos segun el user_identity que reciba al ejecutarse
    const userFound = await this.userCaseUse.getOneUser(authFound.user_identity);
    //verifica de que el usuario que va a usar el codigo de verificacion exista
    if (!userFound) {
      //en caso de que no exista retorna un objeto tipo informativo de no encontrado, propiedades: msg es el mensaje, ok en false y los datos es data: { userFound }
      return {
        message: "Este usuario no se encuentra registrado en la aplicación",
        ok: false,
        status: 404,
        error: {
          message: "Este usuario no existe en la base de datos"
        }
      }
    }
    if(authFound.status===0 || userFound.status===0){
      return {ok:false,status:203,message:"Usuario actualmente deshabilitado, por lo tanto no podrás ingresar a la aplicación"};
    }
    //verifica de que el usuario ya haya cambiado su contraseña por primera vez al crearse en la aplicación
    if (userFound.change_password > 0) {
      //en caso de que el usuario ya haya cambiado su por primera vez,
      return {
        message: "Este usuario ya realizó la configuración de su cuenta",
        ok: false,
        status: 200,
        data: { userFound }
      }
    }
    //requiredCharacters almacena la expresion regular que debe cumplir la nueva contraseña
    const requiredCharacters = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+|~\-=`{}[\]:";'<>?,./])(?!.*\s).{8,}$/;
    //valida que la contraseña cumpla con las expresion regular, test(string) es una funcion que testea el string (texto plano) segun la expresion regular 
    if (requiredCharacters.test(body.password_new) === false) {
      //en caso de que el string no cumpla con la expresion retorna un objeto, propiedades: msg es el mensaje, ok en true y los datos es data: { body }
      return {
        message: "La contraseña debe contener caracteres en mayúscula, números y algún caracter especial ($,@,%)",
        ok: false,
        status: 200,
        data: { body }
      }
    }
    //si no ocurre nada de lo anterior realiza el metodo realiza el cambio de contraseña
    const hashPasswordNew = await bcrypt.hash(body.password_new, 10);
    //authFound.change_password_date = new Date(), esta linea actualiza la fecha de editado de contraseña
    authFound.change_password_date = new Date();
    //change_password_last (ultima contraseña) para a ser la que tenia anteriormente establecida
    authFound.password = hashPasswordNew;
    //la funcion save(authFound) recibe como parametro una entidad, guarda los cambios que se le hizo a la entidad
    await this._auth.save(authFound);
    //la funcion changeStatusChangePassword(authFound.user_identity, 1) cambia el estado (status) que tiene el usuario (user) en la autenticacion (auth) ,
    const userChangePass = await this.userCaseUse.changeStatusChangePassword(authFound.user_identity, 1);
    //la funcion sign(data,secret,algoritm) firma del token de los datos del usuario
    const rol = await this.rolCaseUse.getRol(userFound.rol_id);
    const access_token = sign(
      {
        data: { ...userChangePass, email: authFound.email, rol_level: rol.datos.level }
      }
      , process.env.SECRET_KEY, { algorithm: "HS256" });
    //todo correcto, retorna un objeto, propiedades: msg es el mensaje, ok en true y los datos es data: { body }
    return {
      message: "La asignación de contraseña a tu cuenta se realizó correctamente",
      ok: true,
      status: 200,
      data: access_token
    }
  }

  async deleteCodeVerificationPasswordByEmail(body: DeleteCodeVerificationData) {
    const authUser = await this._auth.findOne({ where: { email: body.email } });
    if (!authUser) {
      return {
        ok: false,
        message: "Credenciales invalidas (correo no existente)",
        statusCode: 404,
        error: {
          message: "Este correo no esta registrado en la base de datos"
        }
      }
    }
    const user = await this.userCaseUse.getOneUser(authUser.user_identity);
    if (!user) {
      return {
        ok: false,
        message: "Usuario no existente",
        statusCode: 404,
        error: {
          message: "El usuario de este correo no existe en la aplicación"
        }
      }
    }
    const codeFound = await this._verifyCode.findOne({ where: { email_auth: body.email } });
    if (!codeFound) {
      return {
        ok: false,
        message: "Este correo no tiene código generado",
        statusCode: 404,
        error: {
          message: "Este codigo no se encuentra registrado"
        }
      }
    }
    //codeDeleted almacena el codigo (code) que se va a eliminar, delete(object) esta funcion elimina un registro de la base de datos
    const codeDeleted = await this._verifyCode.delete({ email_auth: codeFound.email_auth });
    //verifica que hubo fila afectada en la base de datos, si es mayor a cero es porque se eliminó un registro
    if (codeDeleted["affected"] > 0) {
      //retorna true (verdadero) en caso de que se haya eliminado el registro
      return {
        ok: true,
        message: "El codigo generado para este correo fue aliminado con exito",
        status: 200,
      };
    }
    //retorna false (falso) en caso de que no haya eliminado el registro en la base de datos
    return {
      ok: false,
      message: "No se pudo eliminar el codigo que le pertenece a este correo",
      status: 204,
      error: {
        message: "No se encuentra registrado un codigo de verificacion para este correo"
      }
    };
  }

  async changePasswordCodeVerification(body: UseCodeVerificationData): Promise<any> {
    if (body.code.length > 6) {
      return {
        ok: false,
        message: "Código de verificación incorrecto",
        status: 200,
        error: { message: "Este código de verificación es muy largo" }
      }
    }
    if (body.password_new.length < 8) {
      return {
        ok: false,
        message: "La contraseña debe de tener minimo 8 caracteres",
        status: 200,
        error: { message: "La contraseña no cumple con la cantidad minima de caracteres" }
      }
    }
    //authFound guarda el registro de la authentication del usuario registrado en la aplicacion
    const authFound = await this._auth.findOne({ where: { email: body.email } });
    //condicion que verifica si existe el registro en la base de datos
    if (!authFound) {
      //retorna un mensaje de no encontrado en caso de no existir en la base de datos
      return {
        message: "No se encontraron credenciales de este usuario",
        ok: false,
        status: 404,
        error: {
          message: "authentication del usuario no encontrada"
        }
      }
    }
    //userFound almacena un usuario desde la base de datos obtenido con la funcion getOneUser(identityUser) (recibe la identidad del usuario)
    const userFound = await this.userCaseUse.getOneUser(authFound.user_identity);
    if (!userFound) {
      //retorna un mensaje de no encontrado en caso de no existir en la base de datos
      return {
        message: "No se encontró el usuario ",
        ok: false,
        status: 404,
        error: {
          message: "Este usuario no esta registrado"
        }
      }
    }
    //codeVerificationFound almacena el codigo de verificacion desde la base de datos del usuario 
    const codeVerificationFound = await this._verifyCode.findOne({ where: { email_auth: authFound.email } });
    if (!codeVerificationFound) {
      return {
        message: "Este código ya no está disponible para esta acción", ok: false, status: 404, error: { message: "Codigo de verificación ya no existe" }
      }
    }
    if (codeVerificationFound.status === 3) {
      const tokenEmail = sign({ tokenEmail: authFound.email }, process.env.SECRET_KEY, { algorithm: "HS256" });
      await this._verifyCode.delete({ email_auth: authFound.email });
      return {
        message: "El tiempo de uso del código ha caducado", ok: false, data: { tokenEmail }
      }
    }
    if (!codeVerificationFound) {
      //retorna un mensaje de no encontrado en caso de no existir en la base de datos
      return { message: "Este código ya no está disponible para esta acción", ok: false }
    }
    const requiredCharacters = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+|~\-=`{}[\]:";'<>?,./])(?!.*\s).{8,}$/;
    if (requiredCharacters.test(body.password_new) === false) {
      return {
        message: "La contraseña debe contener caracteres en mayúscula, números y algún caracter especial ($,@,%)", ok: false, data: { body }
      }
    }

    if (codeVerificationFound.code === body.code && codeVerificationFound.status === 1 && this.userCaseUse.validateExpiredDateCode(codeVerificationFound.expired_date).bool === true) {
      const comparePasswordNew = await bcrypt.compare(body.password_new, authFound.password);
      const comparePasswordLast = await bcrypt.compare(body.password_new, authFound.change_password_last);
      if (comparePasswordNew === true || comparePasswordLast === true) {
        return {
          ok: false,
          message: "Por favor escriba una contraseña que no haya utilizado anteriormente ",
          status: 200,
          error: {
            message: "Este usuario ya ha utilizado esta conraseña"
          }
        }
      }

      //hash de la nueva contraseña del usuario (bcrypt), incriptacion para mayor seguridad de la cuenta del usuario
      const hashPass = await bcrypt.hash(body.password_new, 10);
      //change_password_last prop de la base de datos, pasa a ser la contraseña antigua del usuario
      authFound.change_password_last = authFound.password;
      //change_password_date fecha de la actualizacion de la contraseña
      authFound.change_password_date = new Date();
      //password contraseña nueva del usuario 
      authFound.password = hashPass;
      //changeStatusChangePassword(identity_user) se encarga de establecer un nuevo estado de cambio de contraseña del usuario (0: no cambiada 1: ya cambiada)
      this.userCaseUse.changeStatusChangePassword(authFound.user_identity, 1);
      //save(entity) guarda los cambios nuevos hechos en la entidad de la base de datos
      this._auth.save(authFound);
      //codeVerificationFound.status se pasa a 2 para indicar de que ya fue usado para la modificación del usuario
      codeVerificationFound.status = 2;
      //save(entity) guarda los cambios nuevos hechos en la entidad de la base de datos
      this._verifyCode.save(codeVerificationFound);
      const codeDeleted = await this._verifyCode.delete({ email_auth: authFound.email });
      if (codeDeleted["affected"] > 0) {
        //retorna mensaje y ok en true en caso de que todo este bien
        return {
          message: "La recuperación de su cuenta ha sido exitosa, contraseña actualizada", ok: true, status: 200
        }
      } else {
        return {
          message: "Hubo un error al utilizar el codigo", ok: false, status: 400
        }
      }
    } else {
      //de lo contrario retorna mensaje de error y ok en false
      await this._verifyCode.delete({ email_auth: codeVerificationFound.email_auth });
      return {
        message: "No se pudo actualizar su contraseña, el tiempo ha caducado, intentelo nuevamente", ok: false

      }
    }

  }

  async verifyExistAccontUser(userEmail: VerifyExistAccontUserData): Promise<any> {
    //user almacena el usuario encontrado en la base de datos
    const user = await this._auth.findOne({ where: { email: userEmail.email } });
    return user;
  }

  randomString(length: number, chars: string) {
    //code almacena la cadena de texto aleatoria , inicalmente estará vacio porque poco a poco se iran acumulando  hasta llegar a 6 caracteres
    let code = '';
    //for limitado hasta la longitud (length) pasado por parametro en cada vuelta el eligirá a un caracter y lo acumula a code
    for (let i = length; i > 0; --i) code += chars[Math.floor(Math.random() * chars.length)];
    //retorna el code (codigo )
    return code;
  }

  async generateVerifyCode(emailUser: VerifyExistAccontUserData): Promise<any> {
    await this._verifyCode.delete({ email_auth: emailUser.email });
    //ramdonCode alamacena el codigo aleatorio de 6 digitos, este codigo (string) hará posible el cambio de contraseña del usuario
    const ramdonCode = this.randomString(6, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
    //userAuthFound almacena la autenticacion del usuario (auth) desde la funcion verifyExistAccontUser(email) (retorna el primer usuario que encuentre en la base de datos)
    const userAuthFound = await this.verifyExistAccontUser(emailUser);
    //validamos de que exista en la base de datos
    if (!userAuthFound) {
      return { ok: false, message: "Este usuario no está registrado en la aplicación", status: 404, error: { userAuthFound } }
    }
    //expiredDate almacena la fecha de expiracion del codigo de verificacion
    const expiredDate = new Date();
    //se establecen nuevos valores de la fecha para colocar la expiracion del codigo de verificacion, incremento de tiempo es de 30 minutos
    expiredDate.setMinutes(expiredDate.getMinutes() + parseInt(process.env.MINUTES_ADITIONAL_CODE_VERIFY));
    //codeVerify objeto de un nuevo registro en la base de datos en la tabla verify_code
    const codeVerify: CreateVerifyCodeDto = {
      code: ramdonCode,
      email_auth: userAuthFound.email,
      expired_date: expiredDate,
      status: 0,
    }
    const user = await this.userCaseUse.getOneUser(userAuthFound.user_identity);
    if (user.change_password === 0) {
      return {
        ok: false,
        message: "Primero debes de terminar la configuración de tu cuenta, revise su correo electrónico ",
        status: 204,
        error: {
          message: "Este usuario no ha completado la configuración de su cuenta"
        }
      }
    }
    //codeNew codigo creado, (este se guadará en la base de datos)
    const codeNew = this._verifyCode.create(codeVerify);
    //esta guardando el registro del codigo en la base de datos
    const codeCreated = await this._verifyCode.save(codeNew);
    //se valida de que se haya guardado en la base de datos
    if (!codeNew && !codeCreated) {
      return {
        message: "No se pudo generar el código de verificación"
      }
    }

    const send = await transporter.sendMail({
      from: '"<franciscojosebellosalcedo@gmail.com>', // sender address
      to: codeCreated.email_auth,
      subject: "SmartInfo ✔",
      text: "BIENVENIDO A THAROT",
      html: `<p style="font-size:15px;"> Hola ${user.username + " " + user.lastname} tu codigo de verificación es: <h2 style="display:inline;">${codeCreated.code}</h2></p>`,
    });
    if (!send) {
      return {
        msg: "No fue posible el envio del codigo de verificación a su correo electrónico", ok: false
      }
    }
    const tokenEmail = sign({ tokenEmail: codeCreated.email_auth }, process.env.SECRET_KEY, { algorithm: "HS256" });
    return {
      message: "Código de verificación enviado con exito, por favor revise su correo electrónico", ok: true, data: codeCreated, tokenEmail
    }
  }

  async codeNoRepete(email: string) {
    const code = await this._verifyCode.findOne({ where: { email_auth: email } });
    return code;
  }

  async changeStatusCode(email: string, status: number) {
    const codeFound = await this._verifyCode.findOne({ where: { email_auth: email } });
    if (!codeFound) {
      return { ok: false, codeFound };
    }
    codeFound.status = status;
    const codeSavingChange = await this._verifyCode.save(codeFound);
    if (!codeSavingChange) {
      return { ok: false, codeSavingChange };
    }
    return { ok: true, codeSavingChange };

  }


  async validateCodeVerify(body: ValidateCodeVerifyData): Promise<verifyCode | any> {
    const codeVerificationDb = await this._verifyCode.findOne({ where: { email_auth: body.email, code: body.code } });
    return codeVerificationDb;
  }

  //se creau una atenticacion
  async createAuth(auth: AuthData): Promise<boolean> {
    const authDB = this._auth.create(auth);
    const res = await this._auth.save(authDB);
    return !res ? false : true;
  }
  //cvalida el usuario
  async validate(email: string, pass: string): Promise<any> {
    const auth = await this._auth.findOne({ where: { email } });
    const isMatch = await bcrypt.compare(pass, auth.password);
    if (auth && isMatch) {
      return true;
    }
    throw new UnauthorizedException();
  }

  //metodo de login de manera local
  async login(email: string, pass: string): Promise<any> {
    const auth = await this._auth.findOne({ where: { email } });
    if (!auth) return null;
    const isMatch = await bcrypt.compare(pass, auth.password);

    const userFound = await this.userCaseUse.getOneUser(auth.user_identity);
    if (userFound.change_password === 0) {
      return {
        msg: "Aún no has terminado la configuración de tu cuenta, por favor asigne su contraseña", ok: false, data: userFound
      }
    }
    if (auth && isMatch) {
      if (!userFound) {
        return {
          msg: "Este usuario no se encuntra en el sistema", ok: false, data: userFound
        }
      }
      if (userFound.status === 0 || auth.status === 0) {
        return {
          msg: "Actualmente estas deshabilitado en la aplicación, por lo tanto no podrás ingresar", ok: false, data: userFound
        }
      }
      const rolUser = await this.rolCaseUse.getRol(userFound.rol_id);
      if (!rolUser) {
        return {
          msg: "Se produjo un error con el rol del usuario", ok: false, data: userFound
        }
      }
      return { err: false, id: auth.user_identity, rol_level: rolUser.datos.level, ok: true };
    }
    return { err: true, data: { auth, isMatch } }
  }

  //metodo de verificacion de usuario con google
  async googleLogin(token: string): Promise<any> {
    const dataUser = verify(token, process.env.SECRET_KEY);
    const emailUser = dataUser["email"];
    if (!emailUser) {
      return {
        message: "Correo no definido (undefined)",
        ok: false,
        status: 404,
        error: { message: "Este correo no se encuentra" }
      }
    }
    const authUser = await this._auth.findOne({ where: { email: emailUser } });
    if (!authUser) {
      return {
        status: 404,
        ok: false,
        message: "Por favor validar usuario",
        error: new NotFoundException()
      }
    }
    const user = await this.userCaseUse.getOneUser(authUser.user_identity);
    if (!user) {
      return {
        status: 404,
        ok: false,
        message: "Por favor validar usuario",
        error: new NotFoundException()
      }
    }
    if (user.status === 0 || authUser.status === 0) {
      return {message: "Actualmente estas deshabilitado en la aplicación, por lo tanto no podrás ingresar",status:200, ok: false}
    }
    
    const rolUser = await this.rolCaseUse.getRol(user.rol_id);

    return {
      message: "Credenciales validas",
      ok: true,
      status: 200,
      datos: {
        authUser,
        user,
        rol_level: rolUser.datos.level
      }
    }

  }
}

