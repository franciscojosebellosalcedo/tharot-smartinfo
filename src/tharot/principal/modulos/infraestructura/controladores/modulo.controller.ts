import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CustomersService } from "../../../customers/infraestructura/servicios/customer.service";
import { ModuloCaseUse } from "../../aplicacion/modulo.case.use";
import { CreateContractsModuloDto, ExtendDateContractDto, UpdateContractsModuloDto } from "../dto/contracts_modulo.dto";
import { CreateModuloDto, UpdateModuloDto } from "../dto/modulo.dto";
import { ContractsModuloService } from "../servicios/contracts_modulo.service";
import { ModuloService } from "../servicios/modulo.service";

@Controller("modulo")
@ApiTags("Modulos (productos)")
export class ModuloController {
  private moduloCaseUse: ModuloCaseUse;
  constructor(private readonly moduloService: ModuloService, private readonly contractService: ContractsModuloService, private readonly customerService: CustomersService) {
    this.moduloCaseUse = new ModuloCaseUse(this.moduloService, this.contractService, this.customerService);
  }
  //CONTRATOS DE MODULOS O PRODUCTOS
  
  // @Patch("contract/update/:idContractModulo")
  // async updateContractModuloById(@Param() param,@Body() body:UpdateContractsModuloDto){
  //   return await this.moduloCaseUse.updateContractModuloById(parseInt(param.idContractModulo),body);
  // }

  @Delete("contract/deleteAll")
  async deleteAllContractsModulo() {
    return await this.moduloCaseUse.deleteAllContractsModulo();
  }

  @Delete("contract/deleteAll/accordingStatus/:idCustomer/:status")
  async deleteAllContractsModuloAccordingStatus(@Param() param) {
    return await this.moduloCaseUse.deleteAllContractsModuloAccordingStatus(parseInt(param.idCustomer),parseInt(param.status));
  }
  
  @Delete("contract/deleteAll/modulo/:idModulo")
  async deleteAllContractsModuloByIdModulo(@Param() param) {
    return await this.moduloCaseUse.deleteAllContractsModuloByIdModulo(parseInt(param.idModulo));
  }

  @Delete("contract/deleteAll/customer/:idCustomer")
  async deleteAllContractsModuloByIdCustomer(@Param() param) {
    return await this.moduloCaseUse.deleteAllContractsModuloByIdCustomer(parseInt(param.idCustomer));
  }

  @Delete("contract/deleteById/:idContractModulo")
  async deleteContractsModuloById(@Param() param) {
    return await this.moduloCaseUse.deleteContractsModuloById(parseInt(param.idContractModulo));
  }

  @Patch("contract/extend/dateExperiration/:idContractModulo")
  async extendDateExpirationContractById(@Param() param, @Body() body: ExtendDateContractDto) {
    return await this.moduloCaseUse.extendDateExpirationContractById(parseInt(param.idContractModulo), body);
  }

  @Get("contractAll/finalized")
  async getAllContractsModuloFinalized() {
    return await this.moduloCaseUse.getAllContractsModuloFinalized();
  }

  @Get("contractAll/modulo/:idModulo")
  async getAllContractsModuloByIdModulo(@Param() param) {
    return await this.moduloCaseUse.getAllContractsModuloByIdModulo(parseInt(param.idModulo));
  }

  @Get("contractAll/customer/:idCustomer")
  async getAllContractsModuloByIdCustomer(@Param() param) {
    return await this.moduloCaseUse.getAllContractsModuloByIdCustomer(parseInt(param.idCustomer));
  }

  @Get("contract/:idContractModulo")
  async getOneContractModuloById(@Param() param) {
    return await this.moduloCaseUse.getOneContractModuloById(parseInt(param.idContractModulo));
  }

  @Get("contract")
  async getAllContractsModulo() {
    return await this.moduloCaseUse.getAllContractsModulo();
  }

  @Post("contract")
  async createContractModulo(@Body() body: CreateContractsModuloDto) {
    return await this.moduloCaseUse.createContractModulo(body);
  }

  //MODULO O PRODUCTOS
  @Patch("enableModulo/:idModulo")
  async enableModuloById(@Param() param) {
    return await this.moduloCaseUse.enableModuloById(parseInt(param.idModulo));
  }

  @Patch("enableAllModulo")
  async enableAllModulo() {
    return await this.moduloCaseUse.enableAllModulo();
  }

  @Delete("deleteAllAccordingStatus/:status")
  async deleteAllModuloAccordingStatus(@Param() param) {
    return await this.moduloCaseUse.deleteAllModuloAccordingStatus(parseInt(param.status));
  }

  @Patch("update/:idModulo")
  async updateModuloById(@Body() body: UpdateModuloDto, @Param() param) {
    return await this.moduloCaseUse.updateModuloById(parseInt(param.idModulo), body);
  }

  @Patch("disableAllModulo")
  async disableAllModulo() {
    return await this.moduloCaseUse.disableAllModulo();
  }

  @Patch("disableModulo/:idModulo")
  async disableModuloById(@Param() param) {
    return await this.moduloCaseUse.disableModuloById(parseInt(param.idModulo));
  }

  @Delete("deleteAll")
  async deleteAllModulo() {
    return await this.moduloCaseUse.deleteAllModulo();
  }

  @Delete(":idModulo")
  async deleteModuloById(@Param() param) {
    return await this.moduloCaseUse.deleteModuloById(parseInt(param.idModulo));
  }

  @Get("accordingStatus/:status")
  async getAllModuloAccordingStatus(@Param() param) {
    return await this.moduloCaseUse.getAllModuloAccordingStatus(parseInt(param.status));
  }

  @Get(":idModulo")
  async getOneModuloById(@Param() param) {
    return await this.moduloCaseUse.getOneModuloById(parseInt(param.idModulo));
  }

  @Get()
  async getAllModulo() {
    return await this.moduloCaseUse.getAllModulo();
  }

  @Post()
  async createModulo(@Body() body: CreateModuloDto) {
    return await this.moduloCaseUse.createModulo(body);
  }

}