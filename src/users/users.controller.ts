import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiAcceptedResponse, ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { AccountsService } from 'src/accounts/accounts.service';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from './users.service';
import { UsersRegisterDTO } from './users-register.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService, private readonly authService: AuthService) { }
    @Post('register')
    @UsePipes(new ValidationPipe())
    @ApiCreatedResponse({ description: 'Account created' })
    @ApiConflictResponse({ description: 'Account Already Exists' })
    @ApiBadRequestResponse({ description: 'Invalid data or data Validation Failed' })
    register(@Body() data: UsersRegisterDTO) {
        return this.usersService.register(data);
    }
    @Post('login')
    @UsePipes(new ValidationPipe())
    @ApiCreatedResponse({ description: 'Login Successfull' })
    @ApiBadRequestResponse({ description: 'Invalid data or data Validation Failed' })
    login(@Body() data: UsersRegisterDTO) {
        return this.authService.login(data);
    }
}
