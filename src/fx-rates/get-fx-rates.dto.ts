import { IsNotEmpty } from 'class-validator';
import { IsCurrency } from '../validators/is-currency.validator';

export class GetFxRatesDto {
    @IsNotEmpty()
    @IsCurrency()
    from_curr: string;

    @IsNotEmpty()
    @IsCurrency()
    to_curr: string;
}