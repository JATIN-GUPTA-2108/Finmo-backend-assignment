import { HttpException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from 'src/schemas/users.schema';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Account } from 'src/schemas/accounts.schema';
import { AuthService } from 'src/auth/auth.service';
import { UsersRegisterDTO } from './users-register.dto';

@Injectable()
export class UsersService {
    constructor(
        private readonly authService:AuthService, 
        @InjectModel('Users') private usersModel: Model<User>, 
        @InjectModel('Accounts') private readonly accountsModel: Model<Account>
    ) { }

    // Method to register a new user
    async register(userData: UsersRegisterDTO) {
        // Check if user already exists
        const res = await this.usersModel.find({ username: userData.username });
        if (res.length === 0) {
            // If user doesn't exist, create a new user
            const newUser = new this.usersModel({
                username: userData.username,
                // Hash the password before saving it to the database
                password: bcrypt.hashSync(userData.password, 10)
            });
            await newUser.save();

            // Create a new account associated with the user
            const newAccount = new this.accountsModel({
                userId: newUser._id,
                balances: new Map<string, number>() 
            });
            await newAccount.save();

            // Return success message with status code 201 (Created)
            return new HttpException(`Account ${userData.username} has been created`, 201);
        } else {
            // If user already exists, return a conflict error with status code 202
            return new HttpException('Account already exists', 202);
        }
    }

    // Method to login a user
    login(data: UsersRegisterDTO) {
        // Delegate the login operation to the AuthService
        return this.authService.login(data);   
    }

}
