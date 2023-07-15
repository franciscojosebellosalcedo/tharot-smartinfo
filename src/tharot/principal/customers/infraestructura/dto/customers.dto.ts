import { ApiProperty } from "@nestjs/swagger";
import {  ArrayNotEmpty, IsArray, IsEmail, IsInt, IsNotEmpty, IsObject, IsOptional, IsPhoneNumber, IsString } from "class-validator";
import { UserData } from "../../../user/dominio/valueobject/user.value";
import { InterfaceEntityCustomers } from "../../dominio/entities/customers.entity";


export class MethodsAvaiblesCustomer{
    @IsString()
    @ApiProperty({description:"Código de la empresa (customer)",example:"00011222"})
    codeCustomer: string;
}
//dto de customer
//dto de datos para crear un customer
export class CreateCustomerDto implements InterfaceEntityCustomers{
    
    @IsInt()
    @IsOptional()
    id?: number;

    @IsNotEmpty({message:"logo no debe de estar vacio"})
    @ApiProperty({description:"Logo del customer (cliente)"})
    @IsOptional()
    logo?: Buffer;

    @IsString({message:"nit debe ser un string"})
    @IsNotEmpty({message:"nit no debe de estar vacio"})
    @ApiProperty({description:"nit del customer (cliente)"})
    nit: string;
    
    @IsNotEmpty({message:"El nombre no debe de estar vacio"})
    @IsString({message:"El name debe ser un string"})
    @ApiProperty({description:"Nombre del customer (cliente o empresa)",required:true,example:"Surtigas"})
    name: string;
    
    
    @IsString({message:"La direccion debe de ser un string"})
    @ApiProperty({description:"Direccion del customer (cliente)",required:true,example:"bocagrande carrera 3 calle 1"})
    @IsNotEmpty({message:"La direccion no debe de estar vacio"})
    address: string;
    
    @IsString({message:"El telefono debe de ser un string"})
    @IsNotEmpty({message:"El telefono no debe de estar vacio"})
    @ApiProperty({description:"telefono del customer (cliente)",required:true,example:"3126433091"})
    phone: string;
    
    @IsEmail()
    @IsString({message:"El email debe de ser un string"})
    @IsNotEmpty({message:"El email no debe de estar vacio"})
    @ApiProperty({description:"email del customer (cliente)",required:true,example:"example@example.com"})
    email: string;

    @IsArray({message:"methods debe ser un array de id de auth-method"})
    @ArrayNotEmpty({message:"El array no debe de estar sin datos"})
    @ApiProperty({description:"Array con los id de los metodos de autenticación seleccinados para este customer",type:[],example:[1,2,3]})
    methods:number[]

    @IsObject({message:"Debe ser un objeto"})
    @IsNotEmpty({message:"User no debe de estar vacio"})
    @ApiProperty({description:"Usuario que se le asigna al customer (administrador)"})
    @IsOptional()
    user?:UserData

    @ApiProperty({description:"Estado del customer (cliente o empresa) , 1:activo, 0:no activo",required:true,example:1})
    @IsInt({message:"El status debe ser un numero entero"})
    @IsOptional()
    status?: number;
}
//dto para editar un customer
export class UpdateCustomerDto {

    @IsString({message:"logo debe de ser un string"})
    @IsNotEmpty({message:"logo no debe de estar estar vacio"})
    @IsOptional({message:"logo es opcional"})
    @ApiProperty({description:"logo nuevo del customer"})
    logo?:Buffer

    @IsString({message:"nit debe de ser un string"})
    @IsNotEmpty({message:"nit no debe de estar vacio"})
    @IsOptional({message:"nit es opcional"})
    @ApiProperty({description:"nit nuevo del customer",example:"123456789"})
    nit?:string;

    @ApiProperty({description:"Nombre del customer (cliente o empresa)",example:"Surtigas"})
    @IsOptional({message:"name es opcional"})
    @IsString({message:"name debe de ser un string"})
    @IsNotEmpty({message:"El nombre no debe de estar vacio"})
    name?: string;

    @IsString({message:"address debe de ser un string"})
    @IsNotEmpty({message:"address no debe de estar vacio"})
    @ApiProperty({description:"address es la direccion nueva del customer"})
    @IsOptional({message:"address es opcional"})
    address?:string;

    @IsOptional()
    @IsArray()
    @IsNotEmpty()
    @ApiProperty({description:"Methods son los metodos de autenticación que podra tener las empresas registradas en la aplicación",example:[1,2,3]})
    methods?:[]

    @IsString({message:"Email debe de ser un string"})
    @IsEmail()
    @IsOptional({message:"Email es opcional"})
    @IsNotEmpty({message:"email no debe de estar vacio"})
    @ApiProperty({description:"Email es el email nuevo del customer"})
    email?:string;

    @IsString({message:"phone debe de ser un string"})
    @IsNotEmpty({message:"phone no debe de estar vacio"})
    @IsOptional({message:"phone es opcional"})
    @ApiProperty({description:"phone es el numero de telefono nuevo de la empresa"})
    @IsPhoneNumber()
    phone?:string;

}

export class AllInfoCustomerUserDto{
    @IsString({message:"identityUser debe de ser un string (texto) "})
    @IsNotEmpty({message:"identity no debe de estar vacio"})
    @ApiProperty({description:"identityUser es el identificador de un unico registro de usuarios en la base de datos",required:true,type:"string",example:"1007130073"})
    identityUser:string
}

