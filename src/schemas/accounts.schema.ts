// user.schema.ts
import { Schema, Types } from 'mongoose';

export const AccountSchema = new Schema({
    userId: { type: Types.ObjectId, required: true , ref: 'Users'},
    balances: {type: Map<String, Number>},
});

export type Account = {
    userId: Types.ObjectId;
    balances: Map<String, Number>;
}
