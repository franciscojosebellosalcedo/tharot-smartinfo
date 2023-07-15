import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsNotEmpty, IsString } from "class-validator";
import { method as MethodEntity } from "../../dominio/entities/method.entity";

export class CreateMethodDto implements MethodEntity {
  @ApiProperty({
    description: "Ingresar el nombre del metodo de autenticacion",
    example: "Google",
  })
  @IsString({message:"El name del metodo debe de ser un string"})
  @IsNotEmpty({message:"El name no debe de estar vacio"})
  name: string;
}
export class ResponseValitationIdMethods{
  @IsBoolean({message:"ok debe ser boolean"})
  ok: boolean;
  @IsArray({message:"idNotFound debe ser un array"})
  idNotFound: number[];
  @IsString({message:"El mensaje debe ser string"})
  message: string;
}
export class UpdateMethodDto extends PartialType(CreateMethodDto) {}
