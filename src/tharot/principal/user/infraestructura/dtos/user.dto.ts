//decoradores de validaciones de datos de la clase class-validator
import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsInt,
  MinLength,
  Min,
  MaxLength,
  Max,
  IsOptional,
  IsEmail,
  IsNumber,
  IsNotEmpty,
  IsJWT,
  IsPhoneNumber,
  IsObject,
} from "class-validator";
import { SessionData } from "../../../session/dominio/valueobject/session.value";
import { loguin, tokenUserGoogle, verifyCode, sessionData } from "../../dominio/entities/user.entity";
//dto (data object transference)

export class ExistAuthByEmailDto{
  @IsString({message:"email debe de ser un string"})
  @IsEmail()
  @IsNotEmpty({message:"email no debe de estar vacio"})
  @ApiProperty({description:"email es el correo electronico del usuario"})
  email: string;
}

export class ValidateAuthenticatorCodeDto{
  @IsString({message:"authenticator_ascii debe de ser un string (texto) "})
  @IsNotEmpty({message:"authenticator_ascii no debe de estar vacio"})
  @ApiProperty({description:"authenticator_ascii es el string (texto) de validación de la authenticación del usuario",example:"Ig!!&#@mV!Krcf6r1m$ML5]Ii1,V$4X*",required:true})
  authenticator_ascii:string;

  @IsNumber()
  @IsNotEmpty({message:"user_id no debe de estar vacio"})
  @ApiProperty({description:"user_id es el identificador del usuario"})
  user_id:number;

  @IsObject({message:"sessionData debe de ser un objeto"})
  @IsNotEmpty({message:"sessionData no debe de estar vacio"})
  @ApiProperty({description:"sessionData son los datos de la sesión que se va a crear"})
  sessionData:sessionData;

  @IsString({message:"authenticator_code debe de ser un string (texto)"})
  @IsNotEmpty({message:"authenticator_code no debe de estar vacio"})
  @ApiProperty({description:"authenticator_code es el código que genera aleatoriamente la aplicación de authenticator de google",example:"002662"})
  authenticator_code:string;
}

export class AllInfoCustomerUserDto {
  @IsString({ message: "La identificacion debe de ser un string (texto)" })
  @IsNotEmpty({ message: "La identificacionno debe de estar vacio" })
  @ApiProperty({description:"identity, identificacion del usuario"})
  identityUser: string;
}
export class ListSessionsActives {
  @IsString({ message: "La identificacion debe de ser un string (texto)" })
  @IsNotEmpty({ message: "La identificacion no debe de estar vacio" })
  @ApiProperty({description:"identity, identificacion del usuario"})
  identity: string;
}
export class DeleteCodeVerificationDto {
  @IsString({ message: "El email debe de ser un string (texto)" })
  @IsNotEmpty({ message: "El email no debe de estar vacio" })
  @IsEmail()
  email: string;
}
//dto para la creacion de un usuario
export class CreateUserDto {

  @IsNumber()
  @IsOptional()
  uid?: number;

  @IsNotEmpty({ message: "entity no debe de estar vacio" })
  @IsString({ message: "Entity debe ser un string " })
  @ApiProperty({ description: "Entity es la identificacion del usuario" })
  @IsOptional()
  identity?: string;

  @ApiProperty({
    description: "Ingresar el email del usuario",
    example: "lamda94@gmail.com",
  })
  @IsEmail()
  @IsNotEmpty({ message: "email no debe de estar vacio" })
  email: string;

  @ApiProperty({
    description: "Ingresar el nombre de usuario",
    example: "Jackson",
  })
  @IsString()
  @MaxLength(50)
  @IsNotEmpty({ message: "username no debe de estar vacio" })
  username: string;

  @ApiProperty({
    description: "Apellido del usuario",
    example: "Martinez",
  })
  @IsString()
  @MaxLength(50)
  @IsNotEmpty({ message: "lastname no debe de estar vacio" })
  lastname: string;


  @IsNumber()
  @IsOptional()
  @IsNotEmpty({ message: "customer_id no debe de estar vacio" })
  customer_id: number;

  @ApiProperty({
    description: "Id del rol del usuario",
    example: "1",
  })
  @IsNumber()
  @IsNotEmpty({ message: "rol_id no debe de estar vacio" })
  rol_id: number;

  @IsInt()
  @IsOptional()
  @Min(0, {
    message: 'El "status" que ingresó no pertenece a las opciones válidas.',
  })
  @Max(3, {
    message: 'El "status" que ingresó no pertenece a las opciones válidas.',
  })
  status: number;

  @IsOptional()
  session_active: number;

  @IsString({ message: "address debe de ser un string" })
  @IsNotEmpty({ message: "address no debe de estar vacio" })
  @ApiProperty({ description: "Address es la direcion del usuario" })
  address: string;

  @IsString({ message: "phone debe de ser un string" })
  @IsNotEmpty({ message: "phone no debe de estar vacio" })
  @ApiProperty({ description: "phone es el numero de telefono del usuario" })
  @IsPhoneNumber()
  phone: string;


  @IsOptional()
  @IsNumber()
  @IsNotEmpty({ message: "change_password no debe de estar vacio" })
  change_password: number;
}

//dto para validar el token
export class LoginGoogleDto implements tokenUserGoogle {
  @IsNotEmpty({ message: "No debe de estar vacio el token" })
  @IsString()
  @IsJWT({ message: "token no valido" })
  @ApiProperty({
    description: "token de acceso al usuario desde google",
    example: "ya32gfr.uiyu?ok.ikikjur",
    required: true
  })
  token: string;
  session: SessionData
}

//dto de loguin del usuario de manera local
export class LoginDto {
  @ApiProperty({
    description: "Ingresar los datos de autenticacion",
    example: {
      "email": "lamda94@gmail.com",
      "password": "123456789"
    },
  })
  @IsNotEmpty({ message: "El email No debe de estar vacio" })
  @IsObject()
  loginData: loguin;

  @ApiProperty({
    description: "Ingresar el email del usuario",
    example: {
      "ip_device": "150.25.1.2",
      "name_device": "windows",
      "name_country": "colombia",
      "city": "cartagena",
      "region": "norte"
    },
  })
  @IsNotEmpty({ message: "El email No debe de estar vacio" })
  @IsObject()
  sessionData: sessionData;
}

export class LogoutDto {
  @IsString()
  @IsNotEmpty({ message: "user_id no debe de estar vacio" })
  @ApiProperty({ description: "id del usuario" })
  user_identity: string;

  @IsString({ message: "ip_device debe de ser un string" })
  @ApiProperty({ description: "ip_device es la ip del dispositivo" })
  @IsNotEmpty({ message: "ip_device no debe de estar vacio" })
  ip_device: string;

  @IsString({ message: "token debe de ser un string" })
  @IsJWT({ message: "token debe de ser un jwt" })
  @IsNotEmpty({ message: "token debe de estar vacio" })
  @ApiProperty({ description: "token de logout" })
  token: string;

}

export class ValidateChangePasswordDto {
  @ApiProperty({
    description: "Ingresar el email del usuario",
    example: "example@example.com",
  })
  @IsNotEmpty({ message: "El email No debe de estar vacio" })
  @IsString({ message: "El email debe de ser un tipo de datostring" })
  @IsEmail()
  email: string;
}
export class VerifyExistAccontUserDto {
  @ApiProperty({
    description: "Ingresar el email del usuario",
    example: "example@example.com",
  })
  @IsNotEmpty({ message: "El email No debe de estar vacio" })
  @IsString({ message: "El email debe de ser un tipo de datostring" })
  @IsEmail()
  email: string;
}


export class CreateVerifyCodeDto implements verifyCode {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsString({ message: "Code debe ser un string" })
  @IsNotEmpty({ message: "Code no debe estar vacio" })
  @MinLength(1, { message: "El codigo debe de tener minimo 6 caracteres" })
  @ApiProperty({ description: "Codigo de verificacion que se enviará como mensaje de texto al correo del usuario" })
  code: string;

  @IsEmail()
  @IsString({ message: "email debe ser un string " })
  @IsNotEmpty({ message: "Code no debe estar vacio" })
  @ApiProperty({ description: "Email del usuario el cual debe cambiar la contraseña" })
  email_auth: string;

  @IsNotEmpty({ message: "expired_date no debe de estar vacio" })
  expired_date: Date;

  @IsInt()
  status: number;

}

export class ValidateCodeVerify {
  @IsEmail()
  @ApiProperty({ description: "Email del usuario para la modificacion de usuario" })
  @IsString({ message: "El email debe de ser un string" })
  @IsNotEmpty({ message: "El email no debe de estar vacio" })
  email: string;

  @ApiProperty({ description: "codigo del usuario para la modificacion de usuario" })
  @IsString({ message: "El codigo debe de ser un string" })
  @IsNotEmpty({ message: "El codigo no debe de estar vacio" })
  @MinLength(6, { message: "code debe tener minimo 6 caracteres" })
  code: string;

}

export class UseCodeVerification {
  @IsEmail()
  @ApiProperty({ description: "Email del usuario para la modificacion de usuario" })
  @IsString({ message: "El email debe de ser un string" })
  @IsNotEmpty({ message: "El email no debe de estar vacio" })
  email: string;

  @ApiProperty({ description: "codigo del usuario para la modificacion de usuario" })
  @IsString({ message: "El codigo debe de ser un string" })
  @IsNotEmpty({ message: "El codigo no debe de estar vacio" })
  code: string;

  @IsNotEmpty({ message: "la contraseña nueva no debe de estar vacia" })
  @IsString({ message: "la contraseña nueva debe ser un string" })
  @ApiProperty({ description: "password nueva para la modificacion de usuario" })
  password_new: string;

}

export class ChangePasswordTirstTimeDto {
  @IsEmail()
  @IsString({ message: "Email debe de ser string" })
  @IsNotEmpty({ message: "Email no debe de estar vacio" })
  @ApiProperty({ description: "Email del usuario del cual va a cambiar su password por primera vez", required: true, example: "example@example.com" })
  email: string;

  @IsString({ message: "password_new debe de ser un string" })
  @IsNotEmpty({ message: "password_new no debe de estar vacio" })
  @ApiProperty({ description: "password_new (contraseña nueva) del usuario del cual va a cambiar su password por primera vez", required: true, example: "87654321" })
  // @MinLength(8, { message: "password_new debe de tener minimo 8 caracteres" })
  // @MaxLength(16, { message: "password_new debe de tener maximo 16 caracteres" })
  password_new: string;
}



//dto de los datos para la modificacion del usuario
export class UpdateUserDto {

  @IsOptional()
  @IsString({ message: "email debe de ser un string" })
  @IsEmail()
  @IsNotEmpty({ message: "email no debe de estar vacio" })
  @ApiProperty({ description: "email es email nuevo del usuario" })
  email?: string;

  @IsOptional()
  @ApiProperty({ description: "rol_id el nuevo rol del usuario"})
  rol_id?: number;

  @IsString({ message: "address debe de ser un string" })
  @IsNotEmpty({ message: "address no debe de estar vacio" })
  @ApiProperty({ description: "address es la direccion nueva del usuario" })
  @IsOptional()
  address?: string;

  @ApiProperty({ description: "username nombre del usuario" })
  @IsString()
  @IsNotEmpty({ message: "username del usuario no debe de estar vacio" })
  @IsOptional()
  username?: string;

  @ApiProperty({ description: "lastname es el apellido del usuario" })
  @IsString()
  @IsNotEmpty({ message: "lastname del usuario no debe de estar vacio" })
  @IsOptional()
  lastname?: string;

  @IsString()
  @ApiProperty({ description: "phone es el número del usuario" })
  @IsOptional()
  phone?: string;
}


export class ChangePasswordDto {
  @IsNotEmpty({ message: "identity no debe de estar vacio" })
  @IsString({ message: "identity debe ser un string " })
  @ApiProperty({ description: "identity es la identificacion del usuario" })
  identity: string;

  @IsNotEmpty({ message: "la contraseña antigua no debe de estar vacia" })
  @IsString({ message: "la contraseña antigua debe ser un string" })
  @ApiProperty({ description: "password antigua  para la verificacion de modificacion de usuario" })
  password_last: string;

  @IsNotEmpty({ message: "la contraseña nueva no debe de estar vacia" })
  @IsString({ message: "la contraseña nueva debe ser un string" })
  @ApiProperty({ description: "password nueva del usuario" })
  password_new: string;
}

export class MethodTwoPassLoginDto {
  @IsString({ message: "email debe de ser un string" })
  @ApiProperty({ description: "email del usuario", required: true, example: "example@example.com" })
  @IsNotEmpty({ message: "email no debe de estar vacio" })
  @IsEmail()
  email: string;

  @IsString({ message: "password debe de ser un string" })
  @IsNotEmpty({ message: "password no debe de estar vacio" })
  @MaxLength(16, { message: "password debe de tener como maximo 16 caracteres" })
  @MinLength(8, { message: "password debe de tener como manimo 8 caracteres" })
  @ApiProperty({ description: "contraseña del usuario", required: true, example: "12345678" })
  password: string;

  @IsString({ message: "ip_device debe de ser un string" })
  @IsNotEmpty({ message: "ip_device no debe de estar vacio" })
  @ApiProperty({ description: "ip_device es la ip del dispositivo de donde quiere iniciar sesion" })
  ip_device: string;
}