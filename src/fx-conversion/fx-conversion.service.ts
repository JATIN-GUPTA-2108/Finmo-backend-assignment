import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AccountsService } from 'src/accounts/accounts.service';
import { FxRatesService } from 'src/fx-rates/fx-rates.service';

@Injectable()
export class FxConversionService {
    constructor(private readonly fxRatesService: FxRatesService,
        private readonly accountsService: AccountsService
    ) { }

    async convertFx(userId: string, from_curr: string, to_curr: string, amount: number, quoteId: string): Promise<{ convertedAmount: number, currency: string }> {
        const response = await this.fxRatesService.fetchFxRates(from_curr, to_curr);
        console.log(response.quoteId, quoteId)
        if (response.quoteId !== quoteId) {
            throw new HttpException('Invalid quoteId or quoteId expired', HttpStatus.BAD_REQUEST);
        }
        let balanceAmount = await this.accountsService.getBalance(userId, from_curr);
        if (Number(balanceAmount) < amount) {
            throw new HttpException('Insufficient balance',HttpStatus.BAD_REQUEST);
        }
        else {
            await this.accountsService.topUp(userId, -amount, from_curr);
            await this.accountsService.topUp(userId, amount * response.exchangeRate, to_curr);
        }
        return { convertedAmount: amount * response.exchangeRate, currency: to_curr };
    }
}
