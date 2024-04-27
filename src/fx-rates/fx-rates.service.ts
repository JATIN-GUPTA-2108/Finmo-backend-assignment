// fx-rates.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { v4 as uuidv4 } from 'uuid';
uuidv4();

@Injectable()
export class FxRatesService {

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        @Inject('CACHE_MANAGER') private cacheService: Cache
    ) { }

    async fetchFxRates(from_curr: string, to_curr: string) {
        
        if (await this.isCached(from_curr, to_curr)) {
            const cachedData=await this.getCachedData(from_curr, to_curr);
            console.log("cache",cachedData)
            return {
                quoteId: cachedData.quoteId,
                expiry: cachedData.expiry,
                exchangeRate: cachedData.exchangeRate
            }
        }
        const apiKey = this.configService.get<string>('ALPHAVANTAGE_API_KEY');
        const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${from_curr}&to_currency=${to_curr}&apikey=${apiKey}`;
        console.log(url)
        const { data } = await this.httpService.get(url).toPromise();
       
        // data: {
        //     'Realtime Currency Exchange Rate': {
        //       '1. From_Currency Code': 'USD',
        //       '2. From_Currency Name': 'United States Dollar',
        //       '3. To_Currency Code': 'INR',
        //       '4. To_Currency Name': 'Indian Rupee',
        //       '5. Exchange Rate': '83.31000000',
        //       '6. Last Refreshed': '2024-04-25 15:35:01',
        //       '7. Time Zone': 'UTC',
        //       '8. Bid Price': '83.30800000',
        //       '9. Ask Price': '83.31000000'
        //     }
        //   }

        console.log(data);
        if (data && data['Realtime Currency Exchange Rate']) {
            const quoteId = uuidv4();
            await this.cacheService.set(`${from_curr}-${to_curr}`, { quoteId, data: data, expiry: Date.now() + 3000000 }, 3000000)
            const cachedData = await this.getCachedData(from_curr, to_curr);
            console.log("gefafas",cachedData)
            return {
                quoteId: cachedData.quoteId,
                expiry: cachedData.expiry,
                exchangeRate: cachedData.exchangeRate
            }
        }
    }
    async isCached(from_curr: string, to_curr: string) {
        const cachedData = await this.cacheService.get(`${from_curr}-${to_curr}`);
        if (cachedData) {
            if (Date.now() < cachedData['expiry']) {
                return true;
            }
        }
        return false;
    }
    async getCachedData(from_curr: string, to_curr: string) {
        const cachedData = await this.cacheService.get(`${from_curr}-${to_curr}`);
        if (cachedData) {
            return {
                quoteId: cachedData['quoteId'],
                expiry: cachedData['expiry'],
                exchangeRate: cachedData['data']['Realtime Currency Exchange Rate']['5. Exchange Rate']
            }
        };
    }
    async getFxRates(from_curr: string, to_curr: string) {
        const data=await this.fetchFxRates(from_curr, to_curr);
        return {
            quoteId: data.quoteId,
            expiry: data.expiry,
        }
    }
}