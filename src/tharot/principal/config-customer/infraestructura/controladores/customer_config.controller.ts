import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CustomersService } from "src/tharot/principal/customers/infraestructura/servicios/customer.service";

import { JwtAuthGuard } from "../../../../../global/dominio/guards/jwt.guard";
import { ConfigCustomerCasoUso } from "../../aplicacion/customer_config.casouso";
import {
  CreateCustomerConfigDto,
  UpdateCustomerConfigDto,
} from "../dtos/customer_config.dto";
import { CustomerConfigService } from "../servicios/customer_config.service";

@ApiTags("Accesibilidad (personalización)")
@Controller("customer-config")
export class CustomerConfigController {
  private configCustomerCasoUso: ConfigCustomerCasoUso;

  constructor(private readonly customerConfig: CustomerConfigService,private readonly customerService:CustomersService) {
    this.configCustomerCasoUso = new ConfigCustomerCasoUso(this.customerConfig,this.customerService);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async getOne(@Param("id") id:number) {
    return await this.configCustomerCasoUso.getConfigCustomer(id)
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createConfig(@Body() payload:CreateCustomerConfigDto){
    return await this.configCustomerCasoUso.createConfigCustomer(payload)
  }

  @UseGuards(JwtAuthGuard)
  @Delete("deleteAll/accordingStatus/:status")
  async deleteAllConfigsCustomersAccordingStatus(@Param() param) {
    return await this.configCustomerCasoUso.deleteAllConfigsCustomersAccordingStatus(parseInt(param.status))
  }

  @UseGuards(JwtAuthGuard)
  @Delete("deleteAll")
  async deleteAllConfigsCustomers() {
    return await this.configCustomerCasoUso.deleteAllConfigsCustomers();
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async delete(@Param("id") id: number) {
    return await this.configCustomerCasoUso.deleteConfigCustomer(id)
  }

  @UseGuards(JwtAuthGuard)
  @Patch("enableAll")
  async enableAllConfigCustomer(){
    return await this.configCustomerCasoUso.enableAllConfigCustomer() ; 
  }

  @UseGuards(JwtAuthGuard)
  @Patch("enable/configCustomer/:idConfigCustomer")
  async enableOneConfigCustomerById(@Param() param){
    return await this.configCustomerCasoUso.enableOneConfigCustomerById(parseInt(param.idConfigCustomer)) ; 
  }

  @UseGuards(JwtAuthGuard)
  @Patch("disableAll")
  async disableAllConfigsCustomers(){
    return await this.configCustomerCasoUso.disableAllConfigsCustomers() ; 
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  async update(@Param() param, @Body() payload:UpdateCustomerConfigDto){
    return await this.configCustomerCasoUso.updateConfigCustomer(parseInt(param.id), payload) ; 
  }

}
