import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account } from 'src/schemas/accounts.schema';

@Injectable()
export class AccountsService {
    constructor(@InjectModel('Accounts') private readonly accountsModel: Model<Account>) { }

    // Method to top up the balance of an account
    async topUp(userId: string, amount: number, currency: string) {
        try {
            // Find the account associated with the user
            const res = await this.accountsModel.findOne({ userId: userId });
            if (!res) {
                // If account doesn't exist, create a new one
                const balances = new Map<string, number>();
                balances.set(currency, amount);
                const newAccount = new this.accountsModel({
                    userId: userId,
                    balances: balances
                });
                newAccount.save();
            } else {
                // If account exists, update the balance
                const balances = res.balances;
                if (balances.has(currency)) {
                    balances.set(currency, Number(balances.get(currency)) + amount);
                } else {
                    balances.set(currency, amount);
                }
                res.save();
                return { message: `Account has been topped up with ${amount} ${currency}` };
            }
        } catch (e) {
            // Handle errors and return internal server error
            return new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    // Method to get the balance of an account for a specific currency
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
                return 0; // Return 0 if balance for the currency is not found
            }
        }
    }

    // Method to get all balances associated with an account
    async getBalances(userId: string) {
        const res = await this.accountsModel.findOne({ userId });
        if (!res) {
            return `Account ${userId} does not exist`;
        } else {
            return res.balances;
        }
    }
}
