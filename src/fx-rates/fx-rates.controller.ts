import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { FxRatesService } from './fx-rates.service';
import { ApiBadRequestResponse, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { GetFxRatesDto } from './get-fx-rates.dto';


@Controller('fx-rates')
export class FxRatesController {

    constructor(private readonly fxRatesService: FxRatesService) { }

    @Get()
    @ApiQuery({ name: 'from_curr', required: true, type: String, description: 'Currency to convert from' })
    @ApiQuery({ name: 'to_curr', required: true, type: String, description: 'Currency to convert to' })
    @ApiOkResponse({ description: 'Returns the quoteId and Expiry time(in milliseconds)' })
    @ApiBadRequestResponse({ description: 'Invalid currency code' })
    @UsePipes(new ValidationPipe())
    getFxRates(@Query() getFxRatesDto: GetFxRatesDto) {
        return this.fxRatesService.getFxRates(getFxRatesDto.from_curr, getFxRatesDto.to_curr);
    }
}
