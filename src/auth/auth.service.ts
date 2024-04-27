import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/users.schema';
import * as bcrypt from 'bcrypt';
import { UsersRegisterDTO } from 'src/users/users-register.dto';

@Injectable()
export class AuthService {
    constructor(@InjectModel('Users') private userModel: Model<User>, private jwtService: JwtService) { }

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userModel.findOne({ username });
        if (user && await bcrypt.compare(password, user.password)) {
            return user;
        }
        return null;
    }

    async validateToken(token: string): Promise<any> {
        try {
            const decoded = this.jwtService.verify(token);
            return decoded;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async login(userData: UsersRegisterDTO) {
        const user = await this.validateUser(userData.username, userData.password);
        if (user) {
            const payload = { username: userData.username, userId: user._id };
            return {access_token: this.jwtService.sign(payload) };
        }
        return { message: 'Invalid username or password' };
    }
}
