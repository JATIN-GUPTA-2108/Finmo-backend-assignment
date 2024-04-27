import { Body, Controller, Req, Get, Post, UseGuards, UsePipes, ValidationPipe, Put } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AuthService } from 'src/auth/auth.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { ApiAcceptedResponse, ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { TopUpDto } from './top-up.dto';
import { ToUpperCasePipe } from 'src/pipes/to-uppercase-pipe';

@Controller('accounts')
export class AccountsController {
    constructor(private readonly accountsService: AccountsService, private readonly authService: AuthService) { }
    @Put('top-up')
    @UsePipes(new ToUpperCasePipe(), new ValidationPipe(),)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiBadRequestResponse({ description: 'Invalid data or data Validation Failed' })
    @ApiOkResponse({ description: 'Top up successful' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    topUp(@Req() request: Request, @Body() data: TopUpDto) {
        console.log(request['user']);
        return this.accountsService.topUp(request['user'].userId, data.amount, data.currency);
    }

    @Get('balances')
    @UseGuards(AuthGuard)
    @ApiOkResponse({ description: 'Balances retrieved' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiBearerAuth()
    getBalances(@Req() request: Request) {
        return this.accountsService.getBalances(request['user'].userId);
    }
}
