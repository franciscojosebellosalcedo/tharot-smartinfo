import {
  CreateDataMail,
  ConfigMailer,
  UpdateConfigMailer,
  UpdateDataMail
} from "../entities/mail.entity";

export class CreateMail implements CreateDataMail {
  titulo: string;
  asunto: string;
  body: string;

  constructor({
    titulo,
    asunto,
    body,
  }: {
    titulo: string;
    asunto: string;
    body: string;
  }) {
    this.titulo = titulo;
    this.asunto = asunto;
    this.body = body;
  }
}

export class UpdateMail implements UpdateDataMail {
    titulo?: string;
    asunto?: string;
    body?: string;
  
    constructor({
      titulo,
      asunto,
      body,
    }: {
      titulo?: string;
      asunto?: string;
      body?: string;
    }) {
      this.titulo = titulo;
      this.asunto = asunto;
      this.body = body;
    }
}

export class CreateConfigMail implements ConfigMailer {
  host: string;
  port: number;
  secure: number;
  email: string;
  secret: string;

  constructor({
    host,
    port,
    secure,
    email,
    secret,
  }: {
    host: string;
    port: number;
    secure: number;
    email: string;
    secret: string;
  }) {
    this.host = host;
    this.port = port;
    this.secure = secure;
    this.email = email;
    this.secret = secret;
  }
}

export class UpdateConfigMail implements UpdateConfigMailer {
    host?: string;
    port?: number;
    secure?: number;
    email?: string;
    secret?: string;
  
    constructor({
      host,
      port,
      secure,
      email,
      secret,
    }: {
      host?: string;
      port?: number;
      secure?: number;
      email?: string;
      secret?: string;
    }) {
      this.host = host;
      this.port = port;
      this.secure = secure;
      this.email = email;
      this.secret = secret;
    }
  }
