import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../../../../../global/dominio/guards/jwt.guard";

import { RolCasoUso } from "../../aplicacion/rol.casouso";
import { RolService } from "../servicios/rol.service";
import { CreateRolDto, UpdateRolDto } from "../dtos/rol.dto";
import { ApiTags } from "@nestjs/swagger";

@UseGuards(JwtAuthGuard)
@ApiTags("Rol (Nivel de administración)")
@Controller("rol")
export class RolController {
  private rolCasoUso: RolCasoUso;

  constructor(private readonly rolService: RolService) {
    this.rolCasoUso = new RolCasoUso(rolService);
  }

  @Get("all/accordingStatus/:status")
  async getAllRolAccordingStatus(@Param() param){
    return await this.rolCasoUso.getAllRolAccordingStatus(parseInt(param.status));
  }

  @Delete("delete/:idRol")
  async deleteRolById(@Param() param){
    return await this.rolCasoUso.deleteRolById(parseInt(param.idRol));
  }

  @Delete("delete/all/accordingStatus/:status")
  async deleteAllRolsAccordingStatus(@Param() param){
    return await this.rolCasoUso.deleteAllRolsAccordingStatus(parseInt(param.status));
  }

  @Delete("delete/all")
  async deleteAllRols(){
    return await this.rolCasoUso.deleteAllRols();
  }

  @Patch("disable/all")
  async disableAllRols(){
    return await this.rolCasoUso.disableAllRols();
  }

  @Patch("disable/:idRol")
  async disableRolById(@Param() param){
    return await this.rolCasoUso.disableRolById(parseInt(param.idRol));
  }

  @Get()
  async getAll() {
    return await this.rolCasoUso.getAllRol();
  }

  @Get(":id")
  async getOne(@Param("id") id: number) {
    return await this.rolCasoUso.getRol(id);
  }

  @Post()
  async create(@Body() payload: CreateRolDto) {
    return await this.rolCasoUso.createRol(payload);
  }

  @Patch(":id")
  async update(@Param() param, @Body() payload: UpdateRolDto) {
    return await this.rolCasoUso.updateRol(parseInt(param.id), payload);
  }

  @Patch("enable/all")
  async enableAllRols(){
    return this.rolCasoUso.enableAllRols();
  }

  @Patch("enable/:id")
  async enableRol(@Param() param){
    return this.rolCasoUso.enableRol(parseInt(param.id));
  }

  @Delete(":id")
  async delete(@Param() param){
    return await this.rolCasoUso.deleteRol(parseInt(param.id));
  }
}
