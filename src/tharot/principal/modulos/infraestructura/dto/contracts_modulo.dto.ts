import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { contractsModuloEntity } from "../../dominio/entities/contracts_modulo.entity";


export class UpdateContractsModuloDto {
    @IsNumber()
    @IsNotEmpty({ message: "id_customer no debe de estar vacio" })
    @ApiProperty({ description: "id_customer es el id de un cliente en especifico", required: true, example: 1 })
    @IsOptional()
    id_customer?: number;

    @IsNotEmpty({ message: "id_modulo no debe de estar vacio" })
    @IsNumber()
    @ApiProperty({ description: "id_modulo es el id de un modulo (producto) en especifico", required: true, example: 1 })
    @IsOptional()
    id_modulo?: number;

    @IsNotEmpty({ message: "date_expiration no debe de estar vacio" })
    @ApiProperty({ description: "date_expiration en la fecha de expiración del contrato del producto", example: new Date(), required: true })
    @IsOptional()
    date_expiration?: Date;

    @IsNumber()
    @IsNotEmpty({ message: "price no debe de estar vacio" })
    @ApiProperty({ description: "price es el precio del contrato" })
    @IsOptional()
    price?: number;
}
export class ExtendDateContractDto {
    @IsNotEmpty({message:"date no debe de estar vacio"})
    @ApiProperty({description:"date es la nueva fecha de expiración del contracto",example:new Date()})
    date: Date;
}
export class CreateContractsModuloDto implements contractsModuloEntity {
    @IsNumber()
    @IsNotEmpty({ message: "id_customer no debe de estar vacio" })
    @ApiProperty({ description: "id_customer es el id de un cliente en especifico", required: true, example: 1 })
    id_customer: number;

    @IsNotEmpty({ message: "id_modulo no debe de estar vacio" })
    @IsNumber()
    @ApiProperty({ description: "id_modulo es el id de un modulo (producto) en especifico", required: true, example: 1 })
    id_modulo: number;

    @IsNotEmpty({ message: "" })
    @ApiProperty({ description: "date_expiration en la fecha de expiración del contrato del producto", example: new Date(), required: true })
    date_expiration: Date;

    @IsString({ message: "validity debe de ser un string (texto)" })
    @IsNotEmpty({ message: "validity no debe de estar vacio" })
    @ApiProperty({ description: "validity es la vijencia del contrato del modulo (producto)" })
    @IsOptional()
    validity?: string;

    @IsNumber()
    @IsNotEmpty({ message: "price no debe de estar vacio" })
    @ApiProperty({ description: "price es el precio del contrato" })
    price: number;
}