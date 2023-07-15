import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { Logger } from '@nestjs/common';
import * as morgan from 'morgan';
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ValidationFilter } from './config/validation.filter';

async function bootstrap() {
  const logger = new Logger('HTTP');
  const customFormat = ':method :url';
  const app = await NestFactory.create(AppModule);
  //activamos los cors para que el front correspondiente consuma la aplicación de backend
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  });
  //configuracion para las documentaciones con swagger
  const config = new DocumentBuilder()
    .setTitle("Tharot Dev")
    .setDescription("Backend del producto Tharot.")
    .setVersion("1.0.0")
    .addTag("User (usuario)", `Estos usuarios son los que le daran uso a las diferentes acciones de la aplicación.`)
    .addTag("Customers (clientes)", "Estos clientes podran tener un perfil dentro de la aplicación")
    .addTag("Modulos (productos)", "Productos que los clientes (customers) podran consumir")
    .addTag("tokens", "Token de acceso de las diferentes entidades.")
    .addTag("Method", "Métodos para iniciar sesión en Tharot (google, facebook, etc..)")
    .addTag("Method-Customer", "Cada vez que se esté registrado un cliente debemos de asignarle los métodos de autenticación para que los usuarios registrados para este cliente puedan iniciar sesión con cualquier de estos métodos.")
    .addTag("Auth (autenticación del usuario)", "Autenticación del usuario, credenciales de inicio de sesión.")
    .addTag("Rol (Nivel de administración)", "Estos roles le dará al usuario un nivel de admistración.")
    .addTag("Notifications (notificaciones del usuario)", "Entidad encargada de notifica todo al usuario.")
    .addTag("Form (formularios dinámicos)","Formularios creados dinámicamente para almacenar otro tipo de información.")
    .addTag("Dashboard (Tablero inicial)","Tablero inicial del usuario en este podra añadir widget entre otras cosas más. ")
    .addTag("Accesibilidad (personalización)","Personalización del usuario en la aplicación a su gusto")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);
  //Se esta declarando una configuracion global de Pipes para las validaciones con class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );
  app.useGlobalFilters(new ValidationFilter());
  app.use(morgan(customFormat, {
    stream: {
      write: (message) => logger.log(message.trim()),
    },
  }));

  await app.listen(process.env.PORT_APP);
}
bootstrap();
