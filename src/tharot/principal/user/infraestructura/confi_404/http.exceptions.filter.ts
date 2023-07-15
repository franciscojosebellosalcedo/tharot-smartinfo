//se esta importanto las Clases para poder validar las rutas
import { ArgumentsHost, ExceptionFilter, HttpException, Catch } from "@nestjs/common";
import { Request, Response } from "express";
//captura de la ruta no reconocida
//implementacion del la interface ExceptionFilter,
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    console.log(exception)
    return response.status(404).json({
      messaje:"Ruta no encontrada",
      statusCode: 404,
      timestam: new Date().toISOString(),
      path: request.url,
    });
  }

}