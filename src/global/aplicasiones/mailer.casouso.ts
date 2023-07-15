import { createTransport } from "nodemailer";
import { MailerRepository } from "../dominio/repository/mailer.repository";
import {
  CreateConfigMail,
  CreateMail,
  UpdateConfigMail,
  UpdateMail,
} from "../dominio/valueobject/mailer.value";

export class Mailer {
  constructor(private readonly mailer: MailerRepository) {}

  async createConfigMail(payload: CreateConfigMail) {
    return await this.mailer.CreateConfigMail(payload);
  }

  async createMail(payload: CreateMail) {
    return await this.mailer.CreateMail(payload);
  }

  async getConfigMail(id: number) {
    return await this.mailer.getConfigMail(id);
  } 

  async UpdateConfigMailer(id: number, payload: UpdateConfigMail) {
    const config = this.mailer.getConfigMail(id);
    if (config) {
      const data = { ...config, ...payload };
      return await this.mailer.updateConfigMail(id, data);
    }
  }

  async sendMail(id:number, {email, asunto, text, body}:{email:string, asunto:string, text:string, body:string}){
    const config = await this.getConfigMail(id);
    const transporter = createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure == 1 ? true : false,
      auth: {
        user: config.email,
        pass: config.secret,
      },
    });
    transporter.sendMail({
      from: config.email,
      to: email,
      subject: asunto,
      text: text,
      html: body
    }, function (error, info) {
      if (error) {
        console.log("Error al enviar email");
      } else {
        console.log("Correo enviado correctamente");
      }
    });
  }
}
