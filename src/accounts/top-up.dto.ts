import { ApiProperty } from "@nestjs/swagger";
import {  IsNumber } from "class-validator";
import { IsCurrency } from "src/validators/is-currency.validator";

export class TopUpDto{
    @ApiProperty({ example: 100, description: 'The amount to top up' })
    @IsNumber()
    amount: number;
    
    @ApiProperty({ example: 'USD', description: 'The currency to top up' })
    @IsCurrency()
    currency: string;
}