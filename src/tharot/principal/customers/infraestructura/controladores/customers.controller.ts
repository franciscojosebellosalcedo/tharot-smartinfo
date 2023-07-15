import { Controller, Get, Post, Delete, Body, Param, UseGuards, Patch } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CustomersCaseUse } from "../../aplicacion/customers.case.use";
import { CreateCustomerDto, UpdateCustomerDto } from "../dto/customers.dto";
import { CustomersService } from "../servicios/customer.service";
import { MethodService } from "../../../auth-method/infraestructura/servicios/method.service";
import { McService } from "../../../method-customer/infraestructura/servicios/mc.service";
import { JwtAuthGuard } from "../../../../../global/dominio/guards/jwt.guard";

//controlador de customer
@ApiTags("Customers (clientes)")
@Controller("customers")
export class CustomerController {

  private customerCaseUse: CustomersCaseUse;
  constructor(
    private readonly customerService: CustomersService,
    private readonly methodService: MethodService,
    private readonly mcService: McService
  ) {
    this.customerCaseUse = new CustomersCaseUse(this.customerService, this.methodService, this.mcService);
  }

  @Patch("enable/:customerId")
  enableCustomer(@Param() param) {
    return this.customerCaseUse.enableCustomer(parseInt(param.customerId));
  }

  //crea un customer
  @UseGuards(JwtAuthGuard)
  @Post("new")
  createNewCustomer(@Body() customer: CreateCustomerDto) {
    return this.customerCaseUse.createCustomer(customer);
  }
  //elimina todos los customers
  @UseGuards(JwtAuthGuard)
  @Delete("delete/all/:customerId")
  async deleteAllCustomers(@Param() param) {
    return await this.customerCaseUse.deleteAllCustomers(parseInt(param.customerId));
  }

  //elimina un customer
  @UseGuards(JwtAuthGuard)
  @Delete("delete/:customerId")
  deleteCustomer(@Param() param) {
    return this.customerCaseUse.deleteCustomer(parseInt(param.customerId));
  }

  @UseGuards(JwtAuthGuard)
  @Patch("update/:customerId")
  updateCustomer(@Body() body: UpdateCustomerDto, @Param() param) {
    return this.customerCaseUse.upadateCustomer(parseInt(param.customerId), body);
  }

  //obtiene todos los customer de acuerdo al status
  @UseGuards(JwtAuthGuard)
  @Get("all/accordingStatus/:status")
  getAllCustomersAccordingStatus(@Param() param) {
    return this.customerCaseUse.getAllCustomersAccordingStatus(parseInt(param.status));
  }

  //obtiene todos los customer
  @UseGuards(JwtAuthGuard)
  @Get("all")
  getAllCustomer() {
    return this.customerCaseUse.getAllCustomers();
  }
  //obtiene un customer
  @UseGuards(JwtAuthGuard)
  @Get("customer/:customerId")
  getCustomerById(@Param() param) {
    return this.customerCaseUse.getCustomerById(parseInt(param.customerId));
  }
}
