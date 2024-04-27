import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";
import { IsCurrency } from "src/validators/is-currency.validator";

export class ConversionDto{
    @ApiProperty({ example: 'JPY', description: 'The currency to convert from' })
    @IsCurrency()
    @IsNotEmpty()
    fromCurrency: string;
    
    @ApiProperty({ example: 'NGN', description: 'The currency to convert to' })
    @IsCurrency()
    @IsNotEmpty()
    toCurrency: string;
    
    @ApiProperty({ example: 100, description: 'The amount to convert' })
    @IsNumber()
    amount: number;
    
    @ApiProperty({ example: '1234', description: 'The quote id' })
    @IsNotEmpty()
    quoteId: string;
} 