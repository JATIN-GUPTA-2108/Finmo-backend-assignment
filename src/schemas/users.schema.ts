import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema()
export class UserModel extends Document {
    @Prop({ required: true })
    @ApiProperty({ example: 'john_doe', description: 'The username of the user' })
    username: string;

    @Prop({ required: true })
    @ApiProperty({ example: 'JohnDoe#7896', description: 'The Password of the user' })
    password: string;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
export type User = UserModel & Document;