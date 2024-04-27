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
    async register(userData: UsersRegisterDTO) {
        const res = await this.usersModel.find({ username: userData.username });
        if (res.length === 0) {
            const newUser = new this.usersModel({
                username: userData.username,
                password: bcrypt.hashSync(userData.password, 10)
            });
            await newUser.save();
            const newAccount = new this.accountsModel({
                userId: newUser._id,
                balances: new Map<string, number>()
            });
            await newAccount.save();

            return new HttpException(`Account ${userData.username} has been created`,201);
        } else {
            return new HttpException('Account already exists', 202);
        }
    }

    login(data: UsersRegisterDTO) {
        return this.authService.login(data);   
    }

}
