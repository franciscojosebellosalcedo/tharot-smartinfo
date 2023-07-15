import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from "class-validator";
import { InterfaceTokenEntity } from "../../dominio/entities/token.entity";

export class CreateTokenDto implements InterfaceTokenEntity{
    @IsPositive({message:"el id debe ser positivo"})
    @IsInt()
    @IsOptional()
    id?: number;

    @ApiProperty({description:"Id del metodo de auntenticacion",example:1,type:"int",required:true})
    @IsPositive({message:"el method_id debe ser positivo"})
    @IsInt({message:"El method_id debe ser un numero entero"})
    @IsNotEmpty({message:"method_id no debe de estar vacion"})
    method_id: number;

    @ApiProperty({description:"Id del usuario relacionado al token",example:1,type:"int",required:true})
    @IsPositive({message:"el user_id debe ser positivo"})
    @IsInt({message:"El user_id debe ser un numero entero"})
    @IsNotEmpty({message:"user_id no debe de estar vacion"})
    user_id: number;

    @ApiProperty({description:"Token generado",type:"string",required:true,example:"ya#dd5?yfyj.fg%iuoij%gf$.u?kjihji?"})
    @IsString({message:"El token debe ser un string"})
    @IsNotEmpty({message:"El token no debe de estar vacio"})
    token: string;

    @ApiProperty({description:"Estado del token 1:activo , 0:no activo",example:1,type:"string",default:1,required:true})
    @IsInt({message:"El status debe ser un numero entero"})
    status: number;
}

export class UpdateTokenDto implements InterfaceTokenEntity{
    @IsPositive({message:"el id debe ser positivo"})
    @IsInt({message:"El id del token debe ser un numero entero y positivo"})
    @IsOptional()
    id?: number;

    @ApiProperty({description:"Id del metodo de auntenticacion",example:1,type:"int",required:true})
    @IsPositive({message:"el method_id debe ser positivo"})
    @IsInt({message:"El method_id debe ser un numero entero y positivo"})
    @IsOptional()
    @IsNotEmpty({message:"method_id no debe de estar vacio"})
    method_id: number;

    @ApiProperty({description:"Id del usuario relacionado al token",example:1,type:"int",required:true})
    @IsPositive({message:"el user_id debe ser positivo"})
    @IsInt({message:"El user_id debe ser un numero entero y positivo"})
    @IsOptional()
    @IsNotEmpty({message:"user_id no debe de estar vacio"})
    user_id: number;

    @ApiProperty({description:"Token generado",type:"string",required:true,example:"ya#dd5?yfyj.fg%iuoij%gf$.u?kjihji?"})
    @IsString({message:"El token debe ser un string"})
    @IsOptional()
    @IsNotEmpty({message:"El token no debe de estar vacio"})
    token: string;

    @ApiProperty({description:"Estado del token 1:activo , 0:no activo",example:1,type:"string",default:1,required:true})
    @IsOptional()
    @IsInt({message:"El status debe ser un numero entero y positivo"})
    status: number;
}



