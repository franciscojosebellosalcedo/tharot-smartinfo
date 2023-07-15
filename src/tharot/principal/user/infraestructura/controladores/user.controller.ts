//importando los decoradores necesarios para este controlador
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Patch,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../../../../global/dominio/guards/jwt.guard";
import { UserService } from "../servicios/user.service";
import { UserCasoUso } from "../../aplicacion/user.caso";
import { AllInfoCustomerUserDto, CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { AuthService } from "../servicios/auth.service";
import { SessionService } from "../../../session/infraestructura/servicios/session.service";
import { CustomersService } from "../../../customers/infraestructura/servicios/customer.service";


//controlador user (contiene todos los enpoint del usuario)
@UseGuards(JwtAuthGuard)
@ApiTags("User (usuario)")
@Controller("user")
export class UserController {
  private userCasoUso: UserCasoUso;
  constructor(
    readonly _UserService: UserService,
    readonly _AuthService: AuthService,
    readonly _sessionService: SessionService,
    readonly _CustomerService: CustomersService,
  ) {
    this.userCasoUso = new UserCasoUso(this._UserService, this._AuthService, this._sessionService, this._CustomerService);
  }

  @Post("all-info-customer-user")
  getAllInfoCustomerUser(@Body() body: AllInfoCustomerUserDto) {
    return this.userCasoUso.getAllInfoCustomerByIdentityUser(body);
  }

  @Get("allUser/accordingStatus/:status")
  async getAllUsersAccordingStatus(@Param() param) {
    return await this.userCasoUso.getAllUsersAccordingStatus(parseInt(param.status));
  }

  @Get("all-user-customer/:customerId")
  getAllUserByIdCustomer(@Param() param) {
    return this.userCasoUso.getAllUserByIdCustomer(parseInt(param.customerId));
  }
  //obtiene todos los usuarios, ejecuta la funcion del caso de uso
  @Get()
  getUsers() {
    return this.userCasoUso.getAllUsers();
  }
  //obtiene un unico usuario desde la base de datos,ejecuta la funcion del caso de uso de usuario
  @Get(":identity")
  @HttpCode(HttpStatus.ACCEPTED)
  async getOne(@Param() param) {
    return await this.userCasoUso.getOneUser(param.identity);
  }

  @Get("email-user/:email")
  getOneAuthUserByUserEmail(@Param() param) {
    return this.userCasoUso.getOneAuthUserByUserEmail(param.email);
  }

  //agrega un nuevo usuario a la base de datos
  @Post()
  create(@Body() body: CreateUserDto) {
    const { email, ...userData } = body;
    userData.session_active = 0;
    const dataAuth = { user_identity: "N.A", email };
    return this.userCasoUso.createUser(userData, dataAuth);
  }

  @Patch(":id")
  update(@Param("id") uid: number, @Body() body: UpdateUserDto) {
    return this.userCasoUso.updateUser(uid, body);
  }

  @Patch("enabled/:identity")
  enableUser(@Param() param) {
    return this.userCasoUso.enableUser(param.identity);
  }

  @Delete(":id")
  delete(@Param("id") uid: number) {
    return this.userCasoUso.deleteUser(uid);
  }

}
