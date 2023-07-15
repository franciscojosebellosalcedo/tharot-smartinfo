//importamos librerias y repository para escribir la logica de los casos de usos de la entidad user
import {
  AuthRepository,
  UserRepository,
} from "../dominio/repository/user.repositoty";
import { auth, loguin } from "../dominio/entities/user.entity";
import {
  UserData,
  VerifyExistAccontUserData,
  ValidateCodeVerifyData,
  UseCodeVerificationData,
  ChangePasswordData,
  sessionData_,
  LogoutData,
  MethodTwoPassLoginData,
  ChangePasswordTirstTimeData,
  ValidateChangePasswordUser,
  DeleteCodeVerificationData,
  LoginGoogleData,
  AllInfoCustomerUserData,
  AuthData,
  UpdateUserData,
  ValidateAuthenticatorCodeData,
  ExistAuthByEmailData,
} from "../dominio/valueobject/user.value";
import { NotFoundException } from "@nestjs/common";
import { sign } from "jsonwebtoken";
import { transporter } from "../../../../config";
import { MailerRepository } from "../../../../global/dominio/repository/mailer.repository";
import { Mailer } from "../../../../global/aplicasiones/mailer.casouso";
import { InterfaceCustomersRepository } from "../../customers/dominio/repository/customers.repository";
import { InterfaceSessionRepository } from "../../session/dominio/repository/session.repository";
import { RolRepository } from "../../rol/dominio/repository/rol.respository";
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
// caso de uso de user
export class UserCasoUso {
  private readonly casoMailer: Mailer;
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authRepository?: AuthRepository,
    private sessionRepository?: InterfaceSessionRepository,
    private customerRepository?: InterfaceCustomersRepository,
    private readonly rolRepository?: RolRepository,
    private readonly mailerServices?: MailerRepository
  ) { }

  async getAuthUserByAuthenticatorAscii(ascii: string) {
    return await this.authRepository.getAuthUserByAuthenticatorAscii(ascii);
  }

  async getAuthByEmail(email: string) {
    return await this.authRepository.getAuthByEmail(email);
  }

  async saveChangesAuthUser(auth: AuthData) {
    this.authRepository.saveChangesAuthUser(auth);
  }

  async validateEntitiesAuth(email: string) {
    const authFound = await this.authRepository.getAuthByEmail(email);
    if (!authFound) {
      return { ok: false, status: 404, message: "Usuario no existente en la aplicación" };
    }
    const userFound = await this.userRepository.findUser(authFound.user_identity);
    if (!userFound) {
      return { ok: false, status: 404, message: "Usuario no existente en la aplicación" };
    }
    const customerFound = await this.customerRepository.getCustomerBy_Id(userFound.customer_id);
    if (!customerFound) {
      return { ok: false, status: 404, message: "Este usuario no pertenece a una empresa" };
    } else if (customerFound.status === 0) {
      return { ok: false, status: 203, message: "Empresa actualmente deshabilitada por los tanto no podrás acceder a la aplicación" };
    }
    if (userFound.status === 0 || authFound.status === 0) {
      return { ok: false, status: 203, message: "Actualmente estas deshabilitado, por lo tanto no tienes acceso a la aplicación" };
    }
    return { ok: true };
  }

  async validateAuthenticatorCode(body: ValidateAuthenticatorCodeData) {
    const validation = speakeasy.totp.verify({
      secret: body.authenticator_ascii,
      encoding: process.env.ENCODING_AUTHENTICATOR,
      token: body.authenticator_code
    });
    const userFound = await this.userRepository.findUserById(body.user_id);
    const auth = await this.authRepository.getOneAuthUserByUserIdendity(userFound.identity);
    const rolUser = await this.rolRepository.getRol(userFound.rol_id);
    if (!rolUser) {
      return { ok: false, status: 404, message: "Este usuario no tiene un rol asignado en la aplicación" };
    } else if (rolUser.status === 0) {
      return { ok: false, status: 203, message: "El rol de este usuario esta deshabilitado por lo tanto no podrás acceder a la aplicación" };
    }
    if (validation === true) {

      const { listSession, amount } = await this.sessionRepository.amountSessionActive(userFound.identity);
      if (amount > 2) {
        return {
          message: "Ya tienes demasiadas sesiones activas",
          ok: false,
          error: {
            amount,
            status: 405,
            listSession,
          },
        };
      }

      const access_token = sign(
        {
          data: { user: userFound, rol_level: rolUser.level, email: auth.email },
        },
        process.env.SECRET_KEY,
        { algorithm: "HS256" }
      );

      const user_id = userFound.identity;
      const token = access_token;
      const sessionNew = body.sessionData;
      const sessionD = { ...sessionNew, token, user_id };
      const sessionCreated = await this.sessionRepository.createSession(sessionD);
      if (sessionCreated.ok === false) {
        return {
          ...sessionCreated,
        };
      }
      await this.incrementSessionUserActive(userFound.uid);
      auth.authenticator_status = 1;
      await this.saveChangesAuthUser(auth);
      return {
        ...sessionCreated,
      };
    } else if (validation === false) {
      return { ok: false, status: 203, message: "Código no válido, recuerde haber escaneado el código QR" };
    }
    return validation;
  }

  async generateQRCode(body: ExistAuthByEmailData) {
    const validationEntities = await this.validateEntitiesAuth(body.email);
    if (validationEntities.ok === false) {
      return validationEntities;
    }
    const authFound = await this.authRepository.getAuthByEmail(body.email);
    const userFound = await this.userRepository.findUser(authFound.user_identity);
    const nameAuthenticator = process.env.NAME_AUTHENTICATOR;
    let QR = null;
    if (authFound.otpauth_url_authenticator.length > 10 && authFound.authenticator_ascii.length > 10) {
      QR = await qrcode.toDataURL(authFound.otpauth_url_authenticator);
      if (QR != null) {
        return { ok: true, status: 200, message: "Código QR generado con éxito", datos: { secret: authFound.authenticator_ascii, user: userFound, qr: QR } };
      }
    }
    const secret = speakeasy.generateSecret({
      name: nameAuthenticator
    });
    QR = await qrcode.toDataURL(secret.otpauth_url);
    const authenticatorSecret = secret.ascii;
    const otpauth_url_authenticator = secret.otpauth_url;
    authFound.authenticator_ascii = authenticatorSecret;
    authFound.otpauth_url_authenticator = otpauth_url_authenticator;
    await this.authRepository.saveChangesAuthUser(authFound);
    return { ok: true, status: 200, message: "Código QR generado con éxito", datos: { secret: authenticatorSecret, user: userFound, qr: QR } };

  }

  async googleLogin(body: LoginGoogleData) {
    if (!body) {
      return {
        message: "Los datos para esta acción no estan definidos",
        ok: false,
        status: 204,
        error: {
          message: "No se está recibiendo datos",
        },
      };
    }
    const data = await this.authRepository.googleLogin(body.token);
    if (data.ok === false) {
      return {
        message: data.message,
        ok: false,
        status: 404,
        error: new NotFoundException("No tienes acceso"),
      };
    }
    const { datos } = data;
    const { user, authUser } = datos;
    if (!user || !authUser) {
      return {
        message: "Por favor verifique el correo electrónico",
        ok: false,
        status: 404,
        error: new NotFoundException("No tienes acceso"),
      };
    }
    const customer = await this.customerRepository.getCustomerById(user.customer_id);
    if (!customer) {
      return {
        ok: false, message: "No perteneces a una empresa", status: 404
      }
    }
    if (customer.status === 0) {
      return {
        ok: false, message: "La empresa a la que perteneces actualmente está deshabilitada en la aplicación, por lo tanto no podrás ingresar", status: 200
      }
    }

    const { listSession, amount } = await this.sessionRepository.amountSessionActive(user.identity);

    if (amount > 2) {
      return {
        message: "Ya tienes demasiadas sesiones activas",
        ok: false,
        error: {
          amount,
          status: 405,
          listSession,
        },
      };
    }

    const access_token = sign(
      {
        data: { user: user, rol_level: datos.rol_level, email: authUser.email },
      },
      process.env.SECRET_KEY,
      { algorithm: "HS256" }
    );

    const user_id = datos.user.identity;
    const token = access_token;
    const sessionNew = body.session;
    const sessionD = { ...sessionNew, token, user_id };
    const sessionCreated = await this.sessionRepository.createSession(sessionD);
    if (sessionCreated.ok === false) {
      return {
        ...sessionCreated,
      };
    }
    await this.incrementSessionUserActive(datos.user.uid);
    return {
      ...sessionCreated,
    };
  }

  async getAllUsersAccordingStatus(status: number) {
    if (status < 0 || status > 1) {
      return { ok: false, status: 203, message: "Valor de status no valido (0 inactivo y 1 activo)" };
    }
    const users = await this.userRepository.getAllUsersAccordingStatus(status);
    if (users.length === 0) {
      return { ok: false, status: 204, message: "No se encontraron registros" };
    }
    for (let i = 0; i < users.length; i++) {
      const user: UserData = users[i];
      const auth = await this.authRepository.getOneAuthUserByUserIdendity(user.identity);
      user.email = auth.email;
    }
    return { ok: true, status: 200, message: "Usuarios encontrados", datos: [...users] };
  }

  async getAllAuthUser(): Promise<AuthData[]> {
    return await this.authRepository.getAllAuthUser();
  }

  async getMethodsAvailableUserCustomers(body: VerifyExistAccontUserData) {
    const response = await this.authRepository.getMethodsAvailableUserCustomers(body);
    if (response === 1 || response === 2) {
      return {
        ok: false,
        message: "Usuario no registrado en la aplicación, verifique que su correo electrónico esté bien escrito",
        status: 404,
        error: { message: "Este usuario no esta registrado en la aplicación (base de datos)" }
      }
    } else if (response === 3) {
      return {
        ok: false,
        message: "Usuario actualmente desabilitado en la aplicación",
        status: 204,
        error: { message: "Este usuario está en status 0" }
      }
    } else if (response === 4) {
      return {
        ok: false,
        message: "Antes de acceder a la aplicación debes terminar la configuración de tu cuenta, revise los mensajes de su correo electrónico  ",
        status: 204,
        error: { message: "Este usuario no ha confirado su cuenta" }
      }
    } else if (response === 5) {
      return {
        ok: false,
        message: "Este usuario no pertenece a una empresa",
        status: 204,
        error: { message: "usuario no pertenece a una empresa (customer)" }
      }
    } else if (response === 6) {
      return {
        ok: false,
        message: "La empresa a la que perteneces no tiene agregado métodos de autenticación, por lo tanto no podrás acceder a la aplicación",
        status: 204,
        error: { message: "Este customer no tiene metodos de autenticacion relacionados en la base de datos" }
      }
    }
    const { datos, name_customer } = response;
    return {
      ok: true,
      message: "Métodos de autenticación disponible en la empresa " + name_customer,
      status: 200,
      datos
    }
  }


  async getAllInfoCustomerByIdentityUser(body: AllInfoCustomerUserData) {
    const userFound = await this.userRepository.getAllInfoCustomerByIdentityUser(body);
    if (!userFound) {
      return {
        msg: "Usuario no encontrado", ok: false, data: userFound
      }
    }
    const customerFound = await this.customerRepository.getCustomerById(userFound.customer_id);
    if (!customerFound) {
      return {
        msg: "Se produjo un error con la empresa que registró  a este  usuario", ok: false, data: customerFound
      }
    }
    const user = userFound;
    const customer = customerFound;
    const token = sign(
      {
        user, customer
      }
      , process.env.SECRET_KEY, { algorithm: "HS256" });
    return {
      msg: "Información obtenida con exito", ok: true, data: token
    };
  }

  async updateIdentityAuthUser(identityUser: string, identityNew: string) {
    return await this.authRepository.updateIdentityAuthUser(identityUser, identityNew);
  }

  async updateEmailCodeVerificationByEmail(emailUser: string, emailNewUser: string) {
    return await this.authRepository.updateEmailCodeVerificationByEmail(emailUser, emailNewUser);
  }

  async findUserByPhone(phone: string) {
    return await this.userRepository.findUserByPhone(phone);
  }

  async validateChangePasswordUser(body: ValidateChangePasswordUser) {
    return await this.authRepository.validateChangePasswordUser(body);
  }

  async enabledAuthUser(user: UserData) {
    return await this.authRepository.enabledAuthUser(user);
  }

  async deleteAuthUser(user: UserData) {
    return await this.authRepository.deleteAuthUser(user);
  }

  async getAllUserByIdCustomer(customerId: number) {
    return await this.userRepository.getAllUserByIdCustomer(customerId);
  }

  async methodTwoPassLogin(body: MethodTwoPassLoginData): Promise<any> {
    return this.authRepository.methodTwoPassLogin(body);
  }

  async logout(body: LogoutData) {
    return this.authRepository.logout(body);
  }

  //metodo para ejecutar el login desde el front
  async login(data: loguin, sessionNew: sessionData_) {
    const validateLogin = await this.authRepository.login(
      data.email,
      data.password
    );
    if (!validateLogin) {
      return {
        message: "Campos invalidos, verifique sus credenciales por favor",
        ok: false,
        status: 401,
        datos: null,
      };
    }
    if (validateLogin.err) {
      return {
        message: "Campos invalidos, verifique sus credenciales por favor",
        ok: false,
        status: 203,
        datos: null,
      };
    }
    if (validateLogin.ok === true) {
      const { id } = validateLogin;
      const user = await this.userRepository.findUser(id);
      const customer = await this.customerRepository.getCustomerById(user.customer_id);
      if (!customer) {
        return {
          ok: false, message: "No perteneces a una empresa", status: 404
        }
      }
      if (customer.status === 0) {
        return {
          ok: false, message: "La empresa a la que perteneces actualmente está deshabilitada en la aplicación, por lo tanto no podrás ingresar", status: 200
        }
      }
      if (user.change_password === 0) {
        return {
          ok: false,
          message:
            "Antes de iniciar sesión en la aplicación debes de terminar la configuración de tu cuenta, por favor ingresa al enlace que se te envio a tu correo electronico",
          status: 200,
          error: {
            message: "Este usuario no ha cambiado su contraseña",
          },
        };
      }
      if (user.status === 0) {
        return { ok: false, status: 203, message: "Usuario deshabilitado en la aplicación" };
      }

      if (user) {

        const { listSession, amount } = await this.sessionRepository.amountSessionActive(user.identity);
        if (amount > 2) {
          return {
            message: "Ya tienes muchas sesiones activas",
            ok: false,
            error: {
              amount,
              status: 405,
              listSession,
            },
          };
        }
        const access_token = sign(
          {
            data: {
              user,
              email: data.email,
              rol_level: validateLogin.rol_level,
            },
          },
          process.env.SECRET_KEY,
          { algorithm: "HS256" }
        );
        const sessionD = {
          ...sessionNew,
          token: access_token,
          user_id: user.identity,
        };
        const session = await this.sessionRepository.createSession(sessionD);
        if (session.ok === true) {
          await this.userRepository.incrementSessionUserActive(user.uid);
          return {
            message: session.message,
            ok: true,
            datos: session.datos,
            status: 200,
          };
        }
        if (!session.ok) {
          session.datos.change = user.change_password;
          return session;
        }
        return {
          message: "Usuario logueado con exito",
          ok: true,
          status: 200,
          datos: { access_token, amountSession: amount + 1 },
        };

      }

    }
    return validateLogin;
  }

  async getOneAuthUserByUserEmail(email: string) {
    return await this.authRepository.getOneAuthUserByUserEmail(email);
  }

  async decrementSessionUserActive(userId: number) {
    return this.userRepository.decrementSessionUserActive(userId);
  }

  async incrementSessionUserActive(userId: number) {
    return this.userRepository.incrementSessionUserActive(userId);
  }

  async changePassword(body: ChangePasswordData) {
    const responseChangePassword = await this.authRepository.changePassword(
      body
    );
    if (responseChangePassword.ok === false) {
      return {
        message: responseChangePassword.message,
        ok: false,
        status: responseChangePassword.status,
      };
    }
    return {
      message: responseChangePassword.message,
      ok: true,
    };
  }

  async updateEmailUseByIdentity(identity: string, emailNew: string) {
    return this.authRepository.updateEmailAuthUseByIdentity(identity, emailNew);
  }

  async enableUser(identity: string) {
    const userEnabled = await this.userRepository.enableUser(identity);
    if (userEnabled.status === 1) {
      const authUserEnabled = await this.authRepository.enabledAuthUser(userEnabled);
      return {
        ok: true,
        message: "Usuario activado con exito",
        status: 200,
        datos: { ...userEnabled }
      }
    }
    return userEnabled;

  }

  async changePasswordTirstTime(body: ChangePasswordTirstTimeData) {
    body.email = body.email.trim();
    return await this.authRepository.changePasswordTirstTime(body);
  }

  async getOneAuthUser(email: string) {
    return await this.authRepository.getOneAuthUser(email);
  }

  async getOneAuthUserByUserIdendity(userIdentity: string) {
    return await this.authRepository.getOneAuthUserByUserIdendity(userIdentity);
  }

  async saveChangesUser(user: UserData) {
    this.userRepository.saveChangesUser(user);
  }
  // metodo para la autenticacion de google

  async codeNoRepete(email: string) {
    return await this.authRepository.codeNoRepete(email);
  }

  async changePasswordCodeVerification(body: UseCodeVerificationData) {
    return this.authRepository.changePasswordCodeVerification(body);
  }

  async changeStatusChangePassword(identity: string, changePass: number) {
    return await this.userRepository.changeStatusChangePassword(
      identity,
      changePass
    );
  }

  async generateVerifyCode(emailUser: VerifyExistAccontUserData) {
    return await this.authRepository.generateVerifyCode(emailUser);
  }

  async deleteCodeVerificationPasswordByEmail(
    body: DeleteCodeVerificationData
  ) {
    return this.authRepository.deleteCodeVerificationPasswordByEmail(body);
  }

  async validateCodeVerify(body: ValidateCodeVerifyData) {
    const codeVerificationDbFound =
      await this.authRepository.validateCodeVerify(body);
    if (!codeVerificationDbFound) {
      return { message: "Código de verificación no válido, asegurate de que hayas escrito bien el código", ok: false, status: 404, error: { message: "No se encontró información para la validaion del código", codeVerificationDbFound } }
    }
    const tokenEmail = sign(
      { email: codeVerificationDbFound.email_auth },
      process.env.SECRET_KEY,
      { algorithm: "HS256" }
    );
    if (codeVerificationDbFound.status === 3) {
      return {
        message: "Este código de verificación ya no se puede usar", status: 204, ok: false, error: { message: "El tiempo del codigo caducó" }, data: { codeVerificationDbFound }, tokenEmail
      }
    }
    if (codeVerificationDbFound.status === 2) {
      return {
        message: "Este código de verificación ya no se puede usar", status: 204, ok: false, error: { message: "El código ya fue usado" }, data: { codeVerificationDbFound }, tokenEmail
      }
    }
    if (this.validateExpiredDateCode(codeVerificationDbFound.expired_date).bool === false) {
      const statusVerify = await this.authRepository.changeStatusCode(body.email, 3);
      return { message: "El tiempo estimado de uso del código ha caducado", ok: false, error: { message: "Fecha vencida del código" }, data: { statusVerify } }
    } else {
      const code = await this.authRepository.changeStatusCode(body.email, 1);
      return { ok: true, data: { code } }
    }
  }

  validateExpiredDateCode(dateDb: Date) {
    const currentDate = new Date();
    if (
      currentDate.getHours() === dateDb.getHours() &&
      currentDate.getMinutes() >= dateDb.getMinutes()
    ) {
      return { msg: "Fecha del codigo vencido", bool: false };
    }
    return { msg: "Fecha del codigo vijente", bool: true };
  }

  //metodo para crear un nuevo usuaio
  async createUser(User: UserData, Auth: auth) {
    const customerFound = await this.customerRepository.getCustomerById(User.customer_id);
    if (!customerFound) {
      return { ok: false, status: 404, message: "La empresa que se le desea asignar al usuario no existe en la aplicación" };
    } else if (customerFound.status === 0) {
      return { ok: false, status: 204, message: "La empresa que se le desea asignar al usuario actualmente esta deshabilitada en la aplicación, por lo tanto este nuevo usuario no puede pertenecer a esta empresa" };
    }

    const rolFound = await this.rolRepository.getRol(User.rol_id);
    if (!rolFound) {
      return { ok: false, status: 404, message: "El rol que desea asignar no existe en la aplicación" };
    } else if (rolFound.status === 0) {
      return { ok: false, status: 203, message: "El rol que desea asignar actualmente esta deshabilitado en la aplicación" };
    }

    User.address = User.address.trim();
    User.username = User.username.trim();
    User.lastname = User.lastname.trim();
    User.phone = User.phone.trim();
    Auth.email = Auth.email.trim();

    const authUserFound = await this.authRepository.getOneAuthUser(Auth.email);
    if (authUserFound) {
      return {
        message: "No se pudo crear el usuario con este correo electrónico, por favor ingrese un correo electrónico diferente", ok: false, status: 200
      }
    }
    if (!authUserFound) {
      const user = await this.userRepository.createUser(User);
      user.identity = `${user.uid}-cc`;
      this.saveChangesUser(user);
      Auth.user_identity = `${user.uid}-cc`;
      const auth = await this.authRepository.createAuth(Auth);
      if (!auth) {
        return {
          ok: true,
          message: "Error registrando interno del servidor",
          status: 500,
        };
      }
      const expiresIn = 60;
      let parm = sign({ email: Auth.email, name: user.username + " " + user.lastname }, process.env.SECRET_KEY, {
        algorithm: "HS256",
      });

      const char1 = String.fromCharCode(Math.floor(Math.random() * 26) + 97);
      const char2 = String.fromCharCode(Math.floor(Math.random() * 26) + 97);
      let parm1 = ""
      let punto = {
        status: true,
        position: 0,
      };
      for (let i = 0; i < parm.length; i++) {
        if (parm[i] === ".") {
          parm1 += parm[i];
          punto.status = true;
          punto.position = i;
        } else if (i == punto.position + 5) {
          const char1 = String.fromCharCode(
            Math.floor(Math.random() * 26) + 97
          );
          const char2 = String.fromCharCode(
            Math.floor(Math.random() * 26) + 97
          );
          parm1 += parm[i] + char1 + char2;
          punto.status = false;
        } else {
          parm1 += parm[i];
        }
      }
      //parm = parm.slice(0, 5) + char1 + char2 + parm.slice(5);
      //const token = parm.slice(0,5) + parm.slice(7);
      punto.status = true;
      punto.position = 0;
      let token = "";
      for (let j = 0; j < parm1.length; j++) {
        if (parm1[j] === ".") {
          token += parm1[j];
          punto.status = true;
          punto.position = j;
        } else if (j == punto.position + 6 || j == punto.position + 7) {
          punto.status = false;
        } else {
          token += parm1[j];
        }
      }
      const send = transporter.sendMail({
        from: `<${process.env.EMAIL_EMISOR}>`,
        to: Auth.email,
        subject: "SmartInfo ✔",
        text: "BIENVENIDO A THAROT",
        html: `
        <p style="font-size:16px;">Hola ${user.username + " " + user.lastname}</p> 
        <p style="font-size:15px;"> Ingresa al siguiente enlace para terminar la configuración de tu cuenta:</p> http://tharot.smartinfo.co/?${parm1} 
        <br>
        <br>
        `
      }, function (error, info) {
        if (error) {
          console.log("Error al enviar email");
        } else {
          console.log("Correo enviado correctamente");
        }
      });
      return { ok: true, message: "Usuario creado exitosamente", status: 200, datos: { ...user } };
    }
    return {
      message: "Este usuario ya está registrado en la aplicación",
      ok: false,
    };
  }

  //metodo obtiene a los usuarios refgistrados
  async getAllUsers() {
    const users = await this.userRepository.findAllUser();
    if (users) {
      if (users.length > 0) {
        await Promise.all(users.map(async (user: UserData) => {
          const authUserFound = await this.authRepository.getOneAuthUserByUserIdendity(user.identity);
          user.email = authUserFound.email;
        }));
        return {
          ok: true,
          message: "Usuarios encontrados",
          status: 200,
          datos: users
        };
      }
      return {
        ok: false,
        message: "No hay usuarios registrados",
        status: 404,
        error: {
          message: "No hay usuarios registrados en la base de datos"
        }
      }

    }
    return {
      ok: false,
      message: "No hay usuarios registrados",
      status: 404,
      error: {
        message: "No hay usuarios registrados en la base de datos"
      }
    }

  }
  //metodo para la recuperacion de un usuario
  async verifyExistAccontUser(userEmail: VerifyExistAccontUserData) {
    const authFound = await this.authRepository.verifyExistAccontUser(
      userEmail
    );
    if (!authFound) {
      return {
        message: "No existe un usuario con este correo electrónico",
        ok: false,
        status: 404,
        error: { message: "No se encuentra este usuario en la base de datos" },
      };
    }
    const userFound = await this.userRepository.findUser(
      authFound.user_identity
    );

    const { uid, username, rol_id, lastname } = userFound;
    const access_token = sign(
      { uid, rol_id, username, lastname },
      process.env.SECRET_KEY,
      { algorithm: "HS256" }
    );
    const data = {
      uid,
      rol_id,
      username,
      lastname,
      email: authFound.email,
      access_token,
    };
    return {
      ok: true,
      message: "Datos del usuario",
      status: 200,
      data
    };
  }

  async getOneUser(user_identity: string) {
    const user = await this.userRepository.findUser(user_identity);
    return user;
  }

  async findUserById(id: number) {
    return this.userRepository.findUserById(id);
  }

  //metdod que valida el usuario
  async validate(email: string, pass: string) {
    const valid = this.authRepository.validate(email, pass);
    return valid;
  }

  async deleteUser(id: number) {
    const deleted = await this.userRepository.deleteUser(id);
    if (!deleted) {
      return { ok: false, status: 404, message: "Usuario no existe en la aplicación" };
    } else if (deleted.status === 0) {
      await this.authRepository.deleteAuthUser(deleted);
      return {
        ok: true,
        message: "Usuario desactivado con exito",
        status: 200,
        datos: { ...deleted }
      }
    }
    return deleted;
  }

  async updateUser(id: number, data: UpdateUserData) {
    if (data.rol_id) {
      const rolFound = await this.rolRepository.getRol(data.rol_id);
      if (!rolFound) {
        return { ok: false, status: 404, message: "El rol que desea asignar no existe en la aplicación" };
      } else if (rolFound.status === 0) {
        return { ok: false, status: 203, message: "El rol que desea asignar actualmente está deshabilitado en la aplicación" };
      }
    }
    const keysObjects = Object.keys(data);
    for (let i = 0; i < keysObjects.length; i++) {
      const element = keysObjects[i];
      if (element != "rol_id") {
        data[element] = data[element].trim();
      }
    }
    const userListWithoutCurrent = await (await this.getAllUsers()).datos.filter((user) => user.uid != id);
    if (userListWithoutCurrent.length > 0) {
      if (data.identity) {
        const userFoundByIdentity = userListWithoutCurrent.find((user) => user.identity === data.identity);
        if (userFoundByIdentity) {
          return {
            ok: false,
            message: "No se pudo editar el usuario con este número de identificación",
            status: 204,
            error: { message: "Este cc ya lo tiene otro usuario" }
          }
        }
      }
      if (data.email) {
        const userFoundByEmail = userListWithoutCurrent.find((user) => user.email == data.email);
        if (userFoundByEmail) {
          return {
            ok: false,
            message: "No se pudo editar el usuario con este correo electrónico",
            status: 204,
            error: { message: "Este cc ya lo tiene otro usuario" }
          }
        }
      }

    }

    if (data.identity) {
      if (data.identity.length < 7) {
        return {
          ok: false,
          message: "La cantidad de caracteres del número de identificación no es valida",
          status: 201,
          error: { message: "Este cc contiene pocos caracteres" }
        }
      }
      const regex = /^[0-9]*$/;
      if (regex.test(data.identity) === false) {
        return {
          ok: false,
          message: "Número de identificación no valido, asegurese de no escribir caracteres diferentes",
          status: 205,
          error: {
            message: "Este numero de identificación tiene caracteres no admitidos"
          }
        }
      }
    }
    const { email, ...payload } = data;
    const userFound = await this.findUserById(id);
    if (!userFound) {
      return {
        message: "Este usuario no esta registrado en la aplicación", ok: false, status: 404
      }
    }
    if (data.identity) {
      await this.sessionRepository.updateIdentitySessionUser(userFound.identity, data.identity);
      await this.updateIdentityAuthUser(userFound.identity, data.identity);
    }
    const responseUpdate = await this.userRepository.updateUser(id, payload);
    const { ok, user, rol_level } = responseUpdate;
    if (!user) {
      return {
        message: "Este usuario no esta registrado en la aplicación", ok: false, status: 404
      }
    }
    const authFound = await this.authRepository.getOneAuthUserByUserIdendity(user.identity);
    if (data.email) {
      await this.updateEmailCodeVerificationByEmail(authFound.email, data.email);
      const token = sign(
        {
          data: { user, email: authFound.email, rol_level }
        }
        , process.env.SECRET_KEY, { algorithm: "HS256" });
      if (ok && email) {
        this.authRepository.updateEmailAuthUseByIdentity(user.identity, email);
        user.updatedAt = new Date();
        this.saveChangesUser(user);
        return {
          msg: "Usuario editado con exito", ok: true, data: token
        }
      } else if (ok) {
        return {
          msg: "Usuario editado con exito", ok: false, data: token
        }
      }
    }
    const token = sign(
      {
        data: { user, email: authFound.email, rol_level },
      },
      process.env.SECRET_KEY,
      { algorithm: "HS256" }
    );
    if (ok && email) {
      this.authRepository.updateEmailAuthUseByIdentity(user.identity, email);
      user.updatedAt = new Date();
      this.saveChangesUser(user);
      return {
        msg: "Usuario editado con exito",
        ok: true,
        data: token,
      };
    } else if (ok) {
      return {
        msg: "Usuario editado con exito",
        ok: false,
        data: token,
      };
    }

    return {
      msg: "Error editando el usuario",
      ok: false,
    };
  }
}
