import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../../../../../global/dominio/guards/jwt.guard";

import { FormCasoUso } from '../../aplicacion/form.casouso';
import { FormService } from '../servicios/form.service';
import { CampoService } from '../servicios/campo.service';
import { FormData } from '../../dominio/valueobject/form.value';

import { CreateFormDto } from '../dtos/form.dto';
import { ApiTags } from "@nestjs/swagger";
import { UpdateCampoDto } from "../dtos/campo.dto";
import { SqlService } from "../../../../sql/infraestructura/servicios/sql.service";
import { SubMenuService } from "../../../../principal/menu/infraestructura/servicios/sub_menu.service";
import { MenuService } from "../../../../principal/menu/infraestructura/servicios/menu.service";
import { RolService } from "../../../../principal/rol/infraestructura/servicios/rol.service";
import { MenuRolService } from "../../../../principal/menu_rol/infraestructura/servicios/menu_rol.service";
import { CustomersService } from "../../../../principal/customers/infraestructura/servicios/customer.service";
import { ActionsService } from "../../../../principal/menu/infraestructura/servicios/actions.service";

@UseGuards(JwtAuthGuard)
@ApiTags("Form (formularios dinámicos)")
@Controller("form")
export class FormController {
  private readonly formCasoUso: FormCasoUso;
  constructor(
    readonly formService: FormService,
    readonly campoService: CampoService,
    readonly sqlService: SqlService,
    readonly menuService: MenuService,
    readonly subMenuService: SubMenuService,
    readonly rolService: RolService,
    readonly menuRolService: MenuRolService,
    readonly customerService: CustomersService,
    readonly actionService: ActionsService
  ) {
    this.formCasoUso = new FormCasoUso(
      this.formService, this.campoService, this.sqlService,
      this.menuService, this.subMenuService, this.rolService,
      this.menuRolService, this.customerService, this.actionService
    );
  }

  //ENDPOINT DATOS DE LA TABLA

  @Patch("update-register/:idRegister/:idForm")
  async updateRegisterTableByNameById(@Param() param, @Body() data: object) {
    return await this.formCasoUso.updateRegisterTable(parseInt(param.idRegister), parseInt(param.idForm), data);
  }

  @Patch("enabled-register/:idRegister/:idForm")
  async enabledRegisterTableByNameById(@Param() param) {
    return await this.formCasoUso.enabledRegisterTableByNameById(parseInt(param.idRegister), parseInt(param.idForm));
  }

  @Delete("delete-register/:idRegister/:idForm")
  async deleteRegisterTableByNameById(@Param() param) {
    return await this.formCasoUso.deleteRegisterTableByNameById(parseInt(param.idRegister), parseInt(param.idForm));
  }

  @Get("get-one-register-table/:idRegister/:idForm")
  async getOneRegisterTableByIdFormByIdRegister(@Param() param) {
    return await this.formCasoUso.getOneRegisterTableByIdFormByIdRegister(parseInt(param.idForm), parseInt(param.idRegister));
  }

  @Get("all-data-table/:formId")
  async getAllDataTableByIdForm(@Param() param) {
    return await this.formCasoUso.getAllDataTableByIdForm(parseInt(param.formId));
  }

  @Post("insert-data-table/:idForm")
  async insertDataTable(@Param("idForm") param: number, @Body() body) {
    return await this.formCasoUso.insertData(param, body);
  }

  //ENDPOINT CAMPOS DEL FORMULARIO

  @Get("all-campo/:idForm")
  async getAllCampoByIdForm(@Param() param) {
    return this.formCasoUso.getAllCampoByIdForm(parseInt(param.idForm));
  }

  @Patch("campo/update/:idCampo")
  async updateCampoById(@Param() param, @Body() body: UpdateCampoDto) {
    return this.formCasoUso.updateCampoById(parseInt(param.idCampo), body);
  }

  @Put("disabled/:idForm")
  async disabledFormById(@Param() param) {
    return await this.formCasoUso.disabledFormById(parseInt(param.idForm));
  }

  @Put("enabled/:idForm")
  async enabledFormById(@Param() param) {
    return await this.formCasoUso.enabledFormById(parseInt(param.idForm));
  }

  @Get()
  async getAllForms() {
    return await this.formCasoUso.getAllForms();
  }

  @Get("allForms/customer/:idCustomer")
  async getAllFormsByIdCustomer(@Param() param) {
    return await this.formCasoUso.getAllFormsByIdCustomer(parseInt(param.idCustomer));
  }

  @Get("all/accordingStatus/:status")
  async getAllFormsAccordingStatus(@Param() param) {
    return await this.formCasoUso.getAllFormsAccordingStatus(parseInt(param.status));
  }

  @Get(":id_form")
  async getFormById(@Param("id_form") id_form: number) {
    return await this.formCasoUso.getForm(id_form);
  }

  @Get("list/:id_customer")
  async getListForm(@Param("id_customer") id_customer: number) {
    return await this.formCasoUso.listForm(id_customer);
  }

  @Delete("delete/all/accordingStatus/:status")
  async deleteAllFormsAccordingStatus(@Param() param) {
    return await this.formCasoUso.deleteAllFormsAccordingStatus(parseInt(param.status));
  }

  @Delete("delete/all")
  async deleteAllForms() {
    return await this.formCasoUso.deleteAllForms();
  }

  @Delete("/:idForm")
  async deleteFormById(@Param() param) {
    return await this.formCasoUso.deleteFormById(parseInt(param.idForm));
  }

  @Post()
  async createNewForm(@Body() data: CreateFormDto) {
    const { campos, ...dataForm } = data;
    const form = dataForm as FormData;
    return await this.formCasoUso.registrar(form, campos);
  }

}
