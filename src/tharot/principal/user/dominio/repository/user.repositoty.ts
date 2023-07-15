import {
  UserData, AuthData, VerifyCodeData, VerifyExistAccontUserData, ValidateCodeVerifyData, UseCodeVerificationData,
  ChangePasswordData, LogoutData, MethodTwoPassLoginData, ChangePasswordTirstTimeData, ValidateChangePasswordUser, DeleteCodeVerificationData, UpdateUserData, AllInfoCustomerUserData,
} from '../valueobject/user.value';
import { auth, verifyCode } from '../entities/user.entity';

export interface UserRepository {
  getAllUsersAccordingStatus(status:number):Promise<UserData[] | null>;

  getAllInfoCustomerByIdentityUser(body:AllInfoCustomerUserData):Promise<UserData|null>;
  findAllUser(): Promise<UserData[]>;
  findUser(identity: string): Promise<UserData | null>;
  findUserByPhone(phone: string): Promise<UserData | null>;
  findUserById(id: number): Promise<UserData | null>;
  createUser(data: UserData): Promise<UserData | null>;
  updateUser(uid: number, payload: UpdateUserData): Promise<UserData | any>;
  deleteUser(uid: number): Promise<UserData | null>;
  changeStatusChangePassword(edentity: string, changePass: number): any;
  enableUser(identity: string): Promise<UserData>;
  saveChangesUser(user: UserData): void;
  incrementSessionUserActive(userId: number): Promise<UserData | any>;
  decrementSessionUserActive(userId: number): Promise<UserData | any>;
  getAllUserByIdCustomer(customerId: number): Promise<UserData[]>;
  validateChangePassword(user: UserData);
}

export interface AuthRepository {
  getAuthUserByAuthenticatorAscii(ascii:string):Promise<AuthData | null>;
  getAuthByEmail(email:string): Promise<AuthData | null>;
  saveChangesAuthUser(auth:AuthData);
  getAllAuthUser():Promise<AuthData[] |null>;
  getMethodsAvailableUserCustomers(body:VerifyExistAccontUserData);
  updateIdentityAuthUser(identityUser:string,identityNew:string): Promise<boolean>;
  updateEmailCodeVerificationByEmail(emailUser: string,emailNewUser:string): Promise<boolean>;
  validateChangePasswordUser(body: ValidateChangePasswordUser);
  getOneAuthUserByUserEmail(email: string): Promise<UserData | any>;
  createAuth(auth: AuthData): Promise<boolean>;
  login(email: string, pass: string): Promise<any>;
  validate(email: string, pass: string): Promise<any>;
  googleLogin(token: string): Promise<any>;
  verifyExistAccontUser(userEmail: VerifyExistAccontUserData): Promise<any>;
  logout(body: LogoutData);
  generateVerifyCode(userEmail: VerifyExistAccontUserData): Promise<VerifyCodeData | null> | any;
  validateCodeVerify(body: ValidateCodeVerifyData): Promise<verifyCode | null> | any;
  changeStatusCode(email: string, status: number): any;
  changePasswordCodeVerification(body: UseCodeVerificationData): Promise<any> | any;
  codeNoRepete(email: string): boolean | any;
  deleteCodeVerificationPasswordByEmail(body: DeleteCodeVerificationData): boolean | any;
  changePasswordTirstTime(body: ChangePasswordTirstTimeData): Promise<auth | null> | any;
  getOneAuthUser(email: string): Promise<auth | any>;
  getOneAuthUserByUserIdendity(userIdentity: string): Promise<auth | any>;
  updateEmailAuthUseByIdentity(identityUser: string, emailNew: string): Promise<any>;
  changePassword(body: ChangePasswordData): Promise<any>;
  methodTwoPassLogin(body: MethodTwoPassLoginData): Promise<any>;
  deleteAuthUser(user: UserData);
  enabledAuthUser(user: UserData);
}


