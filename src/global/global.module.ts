import { Module } from '@nestjs/common';
import { ConfigmailService } from './infraestructura/servicios/configmail.service';
import { MailerController } from './infraestructura/controlador/mailer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigMailerModel } from './infraestructura/modelo/configmail.model';
import { MailModel } from './infraestructura/modelo/mail.model';
@Module({
  imports:[TypeOrmModule.forFeature([ConfigMailerModel, MailModel])],
  providers: [ConfigmailService],
  controllers: [MailerController],
  exports: [ConfigmailService]
})
export class GlobalModule {} 
