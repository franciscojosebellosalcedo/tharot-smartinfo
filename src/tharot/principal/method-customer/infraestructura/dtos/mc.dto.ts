import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";
import { mc as McEntity } from "../../dominio/entities/mc.entity";

export class CreateMcDto implements McEntity {
  @ApiProperty({
    description: "Id del metodo de autenticacion",
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty({message:"method_id no debe de estar vacio"})
  method_id: number;

  @ApiProperty({
    description: "Id del cliente",
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty({message:"customer_id no debe de estar vacio"})
  customer_id: number;
}

export class UpdateMcDto extends PartialType(CreateMcDto) {}
