import {
  Body,
  Controller,
  Post,
  Patch,
  UseGuards,
  Delete,
  Get,
  Param,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { UserService } from "../servicios/user.service";
import { UserCasoUso } from '../../aplicacion/user.caso';
import {
  ChangePasswordDto, ChangePasswordTirstTimeDto, DeleteCodeVerificationDto, ExistAuthByEmailDto, LoginDto, LogoutDto,
  MethodTwoPassLoginDto, UseCodeVerification, ValidateAuthenticatorCodeDto, ValidateChangePasswordDto, ValidateCodeVerify, VerifyExistAccontUserDto
} from "../dtos/user.dto";
import { AuthService } from "../servicios/auth.service";
import { JwtAuthGuard } from "../../../../../global/dominio/guards/jwt.guard";
import { SessionService } from "../../../session/infraestructura/servicios/session.service";
import { SessionCreateDto } from "../../../session/infraestructura/dto/session.dto";
import { CustomersService } from "../../../customers/infraestructura/servicios/customer.service";
import { RolService } from "src/tharot/principal/rol/infraestructura/servicios/rol.service";

@ApiTags("Auth (autenticación del usuario)")
@Controller("auth")
export class AuthController {
  private userCaseUse: UserCasoUso;
  constructor(
    readonly _UserService: UserService,
    readonly _AuthService: AuthService,
    readonly _SessionService: SessionService,
    readonly _customerService: CustomersService,
    readonly _rolService:RolService
  ) {
    this.userCaseUse = new UserCasoUso(this._UserService, this._AuthService, this._SessionService,this._customerService,this._rolService);
  }

  @Post("generateQRCode")
  async generateQRCode(@Body() body:ExistAuthByEmailDto){
    return await this.userCaseUse.generateQRCode(body);
  }

  @Post("validationAuthenticatorCode")
  async validateAuthenticatorCode(@Body() body:ValidateAuthenticatorCodeDto){
    return await this.userCaseUse.validateAuthenticatorCode(body);
  }

  @Post("methods-available-customer")
  async getMethodsAvailableUserCustomers(@Body() body:VerifyExistAccontUserDto){
    return this.userCaseUse.getMethodsAvailableUserCustomers(body);
  }

  @Get("list-sessions-actives/:identity")
  async getAllSessionsActivesByIdentity(@Param() param){
    return await this._SessionService.getAllSessionsActivesByIdentity(param.identity);
  }

  @Post("validate-change-password")
  async validateChangePasswordUser(@Body() body:ValidateChangePasswordDto){
    return await this.userCaseUse.validateChangePasswordUser(body);
  }

  @Post("method-twoPass-login")
  async methodTwoPassLogin(@Body() body: MethodTwoPassLoginDto): Promise<any> {
    return this.userCaseUse.methodTwoPassLogin(body);
  }
  
  @Post("login")
  async login(@Body() body: LoginDto) {
    return this.userCaseUse.login(body.loginData, body.sessionData)
  }

  @Post("logout")
  async logout(@Body() body: LogoutDto) {
    return this.userCaseUse.logout(body);
  }

  @Post("exist/accont/user")
  async verifyExistAccontUser(@Body() body: VerifyExistAccontUserDto) {
    return this.userCaseUse.verifyExistAccontUser(body);
  }


  @Post("generate-code")
  async generateVerifyCode(@Body() emailUser: VerifyExistAccontUserDto) {
    return this.userCaseUse.generateVerifyCode(emailUser);
  }


  @Post("validate-code")
  async validateCodeVerify(@Body() body: ValidateCodeVerify) {
    return this.userCaseUse.validateCodeVerify(body);
  }


  @Patch("use-verification-code")
  async useCodeVerification(@Body() body: UseCodeVerification) {
    return this.userCaseUse.changePasswordCodeVerification(body);
  }


  @Post("verify-google")
  async googleLogin(@Body() body: SessionCreateDto) {
    return this.userCaseUse.googleLogin(body);
  }

  @Patch("change-first-password")
  async changePasswordTirstTime(@Body() body: ChangePasswordTirstTimeDto) {
    return this.userCaseUse.changePasswordTirstTime(body);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("change-password")
  changePassword(@Body() body: ChangePasswordDto) {
    return this.userCaseUse.changePassword(body);
  }

  @Delete("delete-code-verification-password")
  async deleteCodeVerificationPasswordByEmail(@Body() body:DeleteCodeVerificationDto){
    return await this.userCaseUse.deleteCodeVerificationPasswordByEmail(body);
  }

}
