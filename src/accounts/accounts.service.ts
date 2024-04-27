import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account } from 'src/schemas/accounts.schema';

@Injectable()
export class AccountsService {
    constructor(@InjectModel('Accounts') private readonly accountsModel: Model<Account>) { }
    async topUp(userId: string, amount: number, currency: string) {
        try {
            const res = await this.accountsModel.findOne({ userId: userId });
            if (!res) {
                const balances = new Map<string, number>();
                balances.set(currency, amount);
                const newAccount = new this.accountsModel({
                    userId: userId,
                    balances: balances
                });
                newAccount.save();
            } else {
                const balances = res.balances;
                if (balances.has(currency)) {
                    balances.set(currency, Number(balances.get(currency)) + amount);
                } else {
                    balances.set(currency, amount);
                }
                res.save();
                return {message:`Account has been topped up with ${amount} ${currency}`};
            }
        } catch (e) {
            return new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    async getBalance(userId: string, currency: string) {
        const res = await this.accountsModel.findOne({
            userId
        });
        if (!res) {
            throw new Error(`Account ${userId} does not exist`);
        } else {
            const balances = res.balances;
            if (balances.has(currency)) {
                return balances.get(currency);
            } else {
                return 0;
            }
        }
    }
    async getBalances(userId: string) {
        const res = await this.accountsModel.findOne({ userId });
        if (!res) {
            return `Account ${userId} does not exist`;
        } else {
            return res.balances;
        }
    }
}