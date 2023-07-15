//inteface de la entidad de user
export interface user {
  uid?: number;
  identity: string;
  customer_id?: number;
  rol_id: number;
  username: string;
  lastname: string;
  change_password:number;
  address:string;
  session_active:number;
  phone:string;
  status: number;
}

export interface userUpdate {
  uid?: number;
  customer_id?: number;
  rol_id?: number;
  username?: string;
  lastname?: string;
  change_password?:number;
  status?: number;
}

//interface de la entidad de auth
export interface auth {
  authenticator_status?:number;
  authenticator_ascii?:string;
  otpauth_url_authenticator?:string;
  user_identity: string;
  email: string;
  password?: string;
  change_password_last?:string;
  status?: number;
}

//interface de para la validacion del token
export interface tokenUserGoogle {
  token: string
}

//interface de los datos de loguin de manera local
export interface loguin {
  email: string;
  // customer_id:number;
  password: string;
}

export interface sessionData {
  ip_device: string;
  name_device: string;
  name_country: string;
  city: string;
  region: string;
}

//interface de los datos de recuperacion de cuenta del usuario
export interface recoverPassword {
  password: string;
}

export interface verifyCode{
  id?: number;
  code:string;
  email_auth:string;
  expired_date:Date;
  status:number;
}