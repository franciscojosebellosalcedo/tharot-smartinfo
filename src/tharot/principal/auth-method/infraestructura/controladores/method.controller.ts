import { Controller, Get, Post, Patch, Param, Body, Delete, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../../../../global/dominio/guards/jwt.guard";

import { MethodCasoUso } from "../../aplicacion/method.casouso";
import { CreateMethodDto, UpdateMethodDto } from "../dtos/method.dto";
import { MethodService } from "../servicios/method.service";

@UseGuards(JwtAuthGuard)
@ApiTags("Method")
@Controller("method")
export class MethodController {
  private methodCasoUso: MethodCasoUso;

  constructor(private readonly rolService: MethodService) {
    this.methodCasoUso = new MethodCasoUso(rolService);
  }

  @Get("all/accordingStatus/:status")
  async getAllMethodsAccordingStatus(@Param() param) {
    return await this.methodCasoUso.getAllMethodsAccordingStatus(parseInt(param.status));
  }

  @Get()
  async getAll() {
    return await this.methodCasoUso.getAllMethods();
  }

  @Get(":id")
  async getOne(@Param("id") id: number) {
    return await this.methodCasoUso.getMethod(id);
  }
  
  @Post()
  async create(@Body() payload: CreateMethodDto) {
    return await this.methodCasoUso.createMethod(payload);
  }

  @Patch("disableAll")
  async disableAllMethods() {
    return await this.methodCasoUso.disableAllMethods();
  }

  @Patch("disable/method/:idMethod")
  async disableMethodById(@Param() param) {
    return await this.methodCasoUso.disableMethodById(parseInt(param.idMethod));
  }
  
  @Patch(":id")
  async update(@Param("id") id: number, @Body() payload: UpdateMethodDto) {
    return await this.methodCasoUso.updateMethod(id, payload);
  }

  @Delete("deleteAll")
  async deleteAllMethods() {
    return await this.methodCasoUso.deleteAllMethods();
  }

  @Delete("deleteAll/accordingStatus/:status")
  async deleteAllMetthosAccordingStatus(@Param() param) {
    return await this.methodCasoUso.deleteAllMetthosAccordingStatus(parseInt(param.status));
  }

  @Delete(":id")
  async delete(@Param("id") id: number) {
    return await this.methodCasoUso.deleteMethod(id);
  }

  @Delete("delete/:idMethod")
  async deleteMethodById(@Param() param) {
    return await this.methodCasoUso.deleteMethodById(parseInt(param.idMethod));
  }

  @Patch("enable/:id")
  async enableMethod(@Param() param){
    return this.methodCasoUso.enableMethod(parseInt(param.id));
  }
}
