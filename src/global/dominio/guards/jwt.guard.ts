import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private jwtService: JwtService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('No se ha proporcionado un token.');
    }

    try {
      //console.log("toke: "+token);      
      const payload = this.jwtService.verify(token, {
        secret: process.env.SECRET_KEY,
      });
      req.user = payload;
      return true;
    } catch (error) {
      console.log("Error:"+error.message);      
      throw new UnauthorizedException('Token no válido');
    }
    
  }
}