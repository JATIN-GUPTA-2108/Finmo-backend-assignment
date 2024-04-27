import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FxRatesService {

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        @Inject('CACHE_MANAGER') private cacheService: Cache
    ) { }

    // Fetch exchange rates for the given currency pair
    async fetchFxRates(from_curr: string, to_curr: string) {
        
        // Check if exchange rates are cached
        if (await this.isCached(from_curr, to_curr)) {
            const cachedData = await this.getCachedData(from_curr, to_curr);
            console.log("Cache hit", cachedData)
            return {
                quoteId: cachedData.quoteId,
                expiry: cachedData.expiry,
                exchangeRate: cachedData.exchangeRate
            }
        }

        // Retrieve API key from configuration
        const apiKey = this.configService.get<string>('ALPHAVANTAGE_API_KEY');
        const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${from_curr}&to_currency=${to_curr}&apikey=${apiKey}`;

        // Make HTTP request to fetch exchange rates
        const { data } = await this.httpService.get(url).toPromise();
       
        // Check if valid exchange rate data is received
        if (data && data['Realtime Currency Exchange Rate']) {
            const quoteId = uuidv4();

            // Cache exchange rate data
            await this.cacheService.set(`${from_curr}-${to_curr}`, { quoteId, data: data, expiry: Date.now() + 3000000 }, 3000000)
            
            // Retrieve cached data
            const cachedData = await this.getCachedData(from_curr, to_curr);
            console.log("Cache miss", cachedData)

            return {
                quoteId: cachedData.quoteId,
                expiry: cachedData.expiry,
                exchangeRate: cachedData.exchangeRate
            }
        }
    }

    // Check if exchange rates are cached for the given currency pair
    async isCached(from_curr: string, to_curr: string) {
        const cachedData = await this.cacheService.get(`${from_curr}-${to_curr}`);
        if (cachedData) {
            if (Date.now() < cachedData['expiry']) {
                return true;
            }
        }
        return false;
    }

    // Retrieve cached exchange rate data for the given currency pair
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

    // Get exchange rates for the given currency pair
    async getFxRates(from_curr: string, to_curr: string) {
        const data = await this.fetchFxRates(from_curr, to_curr);
        return {
            quoteId: data.quoteId,
            expiry: data.expiry,
        }
    }
}
// Sample format  for data needed above (for my own reference)
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
        