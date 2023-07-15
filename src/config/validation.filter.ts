import {
    Catch,
    ArgumentsHost,
    HttpException,
    ExceptionFilter,
  } from '@nestjs/common';
  import { ValidationError } from 'class-validator';
  import { Request, Response } from 'express';
  
  @Catch(HttpException)
  export class ValidationFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
  
      if (exception.getStatus() === 400 && exception.getResponse() instanceof Array) {
        const errors = exception.getResponse() as ValidationError[];
        const errorMessage = {
          ok: false, 
          statusCode: 400,
          message: 'Bad Request',
          errors: (errors.map(error => ({
            property: error.property,
            constraints: error.constraints
          })))[0]
        };
  
        return response.status(400).json(errorMessage);
      }
  
      return response.status(exception.getStatus()).json(exception.getResponse());
    }
  }
  