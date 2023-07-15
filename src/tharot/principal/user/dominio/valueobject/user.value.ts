import { user, auth, userUpdate, verifyCode, sessionData } from "../entities/user.entity";
import { v4 as uuid } from "uuid";

export class ExistAuthByEmailData {
  email: string;
  constructor({ email }: { email: string }) {
    this.email = email;
  }
}

export class ValidateAuthenticatorCodeData {
  user_id: number;
  authenticator_ascii: string;
  authenticator_code: string;
  sessionData: sessionData
  constructor({
    authenticator_ascii,
    authenticator_code,
    user_id,
    sessionData,
  }: {
    authenticator_ascii: string;
    authenticator_code: string;
    user_id: number;
    sessionData: sessionData;
  }) {
    this.authenticator_ascii = authenticator_ascii;
    this.authenticator_code = authenticator_code;
    this.user_id = user_id;
    this.sessionData = sessionData;
  }
}

export class ListSessionsActives {
  identity: string;
  constructor({ identity }: { identity: string }) {
    this.identity = identity;
  }
}
export class AllInfoCustomerUserData {
  identityUser: string;
  constructor({ identityUser }: { identityUser: string }) {
    this.identityUser = identityUser;
  }
}
export class DeleteCodeVerificationData {
  email: string;
  constructor({ email }: { email: string }) {
    this.email = email;
  }
}

export class LoginGoogleData {
  token: string;
  session: sessionData;
  constructor({ token, session }: { token: string, session: sessionData }) {
    this.token = token;
    this.session = session;
  }
}
export class sessionData_ implements sessionData {
  ip_device: string;
  name_device: string;
  name_country: string;
  city: string;
  region: string;

  constructor({ ip_device,
    name_device,
    name_country,
    city,
    region, }: {
      ip_device: string;
      name_device: string;
      name_country: string;
      city: string;
      region: string;
    }) {
    this.ip_device = ip_device;
    this.name_device = name_device;
    this.name_country = name_country;
    this.city = city;
    this.region = region;
  }

}

export class UserData {

  uid?: number;
  identity?: string;
  username: string;
  customer_id?: number;
  rol_id: number;
  lastname: string;
  email?: string;
  status: number;
  session_active: number;
  phone: string;
  change_password: number;
  address: string;

  constructor({
    identity,
    username,
    lastname,
    customer_id,
    rol_id,
    phone,
    address
  }: {
    identity?: string;
    username: string;
    lastname: string;
    customer_id?: number;
    rol_id: number;
    email?: string;
    phone: string;
    session_active: number;
    address: string;
  }) {
    this.uid = uuid();
    this.identity = "121212";
    this.username = username;
    this.lastname = lastname;
    this.rol_id = rol_id;
    this.customer_id = customer_id;
    this.change_password = 0;
    this.phone = phone;
    this.session_active = 0;
    this.email = this.email;
    this.address = address;
    this.status = 1;
  }
}

export class UpdateUserData implements userUpdate {
  identity?: string;
  username?: string;
  customer_id?: number;
  rol_id?: number;
  email?: string;
  lastname?: string;
  phone?: string;
  status?: number;

  constructor({
    identity,
    username,
    lastname,
    email,
    customer_id,
    rol_id,
    phone,
  }: {
    identity?: string;
    username?: string;
    lastname?: string;
    email?: string;
    customer_id?: number;
    phone?: string;
    rol_id?: number;
  }) {
    this.identity = identity;
    this.username = username;
    this.lastname = lastname;
    this.rol_id = rol_id;
    this.phone = phone;
    this.email = email;
    this.customer_id = customer_id;
    this.status = 1;
  }
}

export class AuthData implements auth {
  user_identity: string;
  email: string;
  authenticator_status?: number;
  authenticator_ascii?: string;
  otpauth_url_authenticator?: string;
  status?: number;

  constructor({
    user_identity,
    email,
    authenticator_status,
    authenticator_ascii,
    otpauth_url_authenticator
  }: {
    user_identity: string;
    email: string;
    change_password_last: string;
    password: string;
    otpauth_url_authenticator?: string;
    authenticator_status?: number;
    authenticator_ascii?: string;
  }) {
    this.authenticator_ascii = authenticator_ascii;
    this.authenticator_status = authenticator_status;
    this.user_identity = user_identity;
    this.email = email;
    this.otpauth_url_authenticator=otpauth_url_authenticator;
    this.status = 1;
  }
}


export class VerifyCodeData implements verifyCode {
  id?: number;
  code: string;
  email_auth: string;
  expired_date: Date;
  status: number;

  constructor({ code, email_auth, expired_date }: { code: string, email_auth: string, expired_date: Date }) {
    this.id = uuid();
    this.code = code;
    this.email_auth = email_auth;
    this.expired_date = expired_date;
    this.status = 0;
  }

}

export class ValidateChangePasswordUser {
  email: string;
  constructor({ email }: { email: string }) {
    this.email = email;
  }
}
export class VerifyExistAccontUserData {
  email: string;
  constructor({ email }: { email: string }) {
    this.email = email;
  }
}

export class ValidateCodeVerifyData {
  email: string;
  code: string;
  constructor({ email, code }: { email: string, code: string }) {
    this.email = email;
    this.code = code;
  }
}
export class ChangePasswordTirstTimeData {
  email: string;
  password_new: string;
  constructor({ email, password_new }: { email: string, password_new: string }) {
    this.email = email;
    this.password_new = password_new;
  }
}
export class UseCodeVerificationData {
  email: string;
  code: string;
  password_new: string;
  constructor({ email, code, password_new }: { email: string, code: string, password_new: string }) {
    this.email = email;
    this.code = code;
    this.password_new = password_new;
  }
}

export class LogoutData {
  user_identity: string;
  token: string;
  ip_device: string;
  constructor(
    {
      user_identity,
      token,
      ip_device
    }: {
      user_identity: string,
      token: string,
      ip_device: string
    }
  ) {
    this.user_identity = user_identity;
    this.token = token;
    this.ip_device = ip_device;
  }
}

export class ChangePasswordData {
  identity: string;
  password_last: string;
  password_new: string;

  constructor({ identity, password_last, password_new }: { identity: string, password_last: string, password_new: string }) {
    this.identity = identity;
    this.password_last = password_last;
    this.password_new = password_new;
  }
}
export class MethodTwoPassLoginData {
  email: string;
  ip_device: string;
  password: string;

  constructor({ email, ip_device, password }: { email: string, ip_device: string, password: string }) {
    this.email = email;
    this.ip_device = ip_device;
    this.password = password;
  }
}

