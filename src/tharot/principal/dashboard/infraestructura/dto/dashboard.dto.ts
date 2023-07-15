import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { columnEntity, dashboardEntity } from "../../dominio/entities/dashboard.entity";

export class CreateDashboardDto implements dashboardEntity{

    @IsNumber()
    @IsNotEmpty({message:"user_id no debe de estar vacio (id del usuario que crea el dashboard)"})
    @ApiProperty({description:"id del usuario ",required:true,example:1})
    user_id: number;

    @IsString({message:"distribution debe de ser un string (texto)"})
    @IsNotEmpty({message:"distribution no debe de estar vacio"})
    @ApiProperty({description:"distribution es como quiere el usuario ver las columnas del dashboard",required:true})
    distribution: string;

    @IsNumber()
    @IsNotEmpty({message:"amount_column no debe de estar vacio"})
    @ApiProperty({description:"amount_column es el número de columnas que tendrá el dashboard",required:true})
    amount_column: number;

    @IsArray({message:"columns debe de ser un array"})
    @ApiProperty({description:"columns, columnas del dashboard creado"})
    @IsOptional()
    columns?:CreateColumnDto[];
}

export class CreateColumnDto implements columnEntity{
    @ApiProperty({description:"dashboard_id es el id del dashboard  que va a contener la columna",required:true})
    @IsNumber()
    @IsNotEmpty({message:"dashboard_id no debe de estar vacio"})
    @IsOptional()
    dashboard_id?: number;

    @IsString({message:"title debe de ser un string (texto)"})
    @IsNotEmpty({message:"title no debe de estar vacio"})
    @ApiProperty({description:"title es el titulo de la columna que se va agregar"})
    title: string;
}

export class CreateWidgetDto {
    @IsNumber()
    @IsNotEmpty({message:"column_id no debe de estar vacio"})
    @ApiProperty({description:"column_id es el id de la columna a la que va a pertenecer el widget"})
    @IsOptional()
    column_id?: number;

    @IsString({message:"title debe de ser un string (texto)"})
    @IsNotEmpty({message:"title no debe de estar vacio"})
    @ApiProperty({description:"title es el titulo del widget"})
    title: string;

    @IsString({message:"content debe de ser un string"})
    @IsNotEmpty({message:"content no debe de estar vacio"})
    @ApiProperty({description:"content es el tipo de contenido que tendra el widget"})
    content: string;

    @IsString({message:"data debe ser un string"})
    @IsNotEmpty({message:"data no debe de estar vacio"})
    @ApiProperty({description:"data es el tipo son los datos que tendra en widget"})
    data: string;
}
export class ChangeIdColumnOfTheWidgetFirstTimeDto{
    @IsNumber()
    @IsNotEmpty({message:"idWidget no debe de esta vacio"})
    @ApiProperty({description:"idWidget es el id del widget que tiene la columna actualmente"})
    idWidget:number;

    @IsNumber()
    @IsNotEmpty({message:"newIdColumn no debe de esta vacio"})
    @ApiProperty({description:"newIdColumn es el id de la columna nueva que va a tener el widget actualmente"})
    idColumn:number;
}
export class ChangeIdColumnOfTheWidgetDto{
    @IsNumber()
    @IsNotEmpty({message:"idWidget no debe de esta vacio"})
    @ApiProperty({description:"idWidget es el id del widget que tiene la columna actualmente"})
    idWidget:number;

    @IsNumber()
    @IsNotEmpty({message:"currentIdColumn no debe de esta vacio"})
    @ApiProperty({description:"currentIdColumn es el id de la columna que tiene el widget actualmente"})
    currentIdColumn: number;

    @IsNumber()
    @IsNotEmpty({message:"newIdColumn no debe de esta vacio"})
    @ApiProperty({description:"newIdColumn es el id de la columna nueva que va a tener el widget actualmente"})
    newIdColumn:number;
}