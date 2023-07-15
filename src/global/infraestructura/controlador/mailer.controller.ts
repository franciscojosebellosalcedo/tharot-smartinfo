import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../../dominio/guards/jwt.guard";
import { Mailer } from "../../aplicasiones/mailer.casouso";
import { ConfigmailService } from "../servicios/configmail.service";
import { ConfigMailerDto, MailDto } from "../dtos/mailer.dtos";
import { ApiTags } from "@nestjs/swagger";

@UseGuards(JwtAuthGuard)
@ApiTags("Mailer")
@Controller("mailer")
export class MailerController {
  private mailer_caso: Mailer;

  constructor(readonly mailerService: ConfigmailService) {
    this.mailer_caso = new Mailer(mailerService);
  }

  @Post("/config")
  async createConfigMail(@Body() payload: ConfigMailerDto) {
    return await this.mailer_caso.createConfigMail(payload);
  }

  @Post("/mail")
  async createMail(@Body() payload:MailDto){
      return await this.mailer_caso.createMail(payload);
  }
}
