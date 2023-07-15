import { Controller, Get, Post, Patch, Param, Body, UseGuards } from "@nestjs/common";
import { McCasoUso } from "../../aplicacion/mc.casouso";
import { McService } from "../servicios/mc.service";
import { CreateMcDto, UpdateMcDto } from "../dtos/mc.dto";
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from "../../../../../global/dominio/guards/jwt.guard";

@UseGuards(JwtAuthGuard)
@ApiTags("Method-Customer")
@Controller("mc")
export class McController {
  private mcCasoUso: McCasoUso;

  constructor(private readonly mcService: McService) {
    this.mcCasoUso = new McCasoUso(mcService);
  }

  @Patch("enable/:id")
  enableMC(@Param() param){
    return this.mcCasoUso.enableMC(parseInt(param.id));
  }

  @Get()
  async getAll() {
    return await this.mcCasoUso.getAllMethods();
  }

  @Get(":id")
  async getOne(@Param("id") id: number) {
    return await this.mcCasoUso.getMethod(id);
  }

  @Post()
  async create(@Body() payload: CreateMcDto) {
    return await this.mcCasoUso.createMethod(payload);
  }

  @Patch(":id")
  async update(@Param("id") id: number, @Body() payload: UpdateMcDto) {
    return await this.mcCasoUso.updateMethod(id, payload);
  }
}
