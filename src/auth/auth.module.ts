import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/schemas/users.schema';
import { JwtModule, JwtService } from '@nestjs/jwt';
import configuration from 'src/config/configuration';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Users', schema: UserSchema }]) ,
  ConfigModule.forRoot({load:[configuration]}), 
  JwtModule.register({ global: true, signOptions: { expiresIn: '60m' }, secret: configuration().JWT_SECRET })],
  providers: [AuthService, JwtService],
  exports: [MongooseModule.forFeature([{ name: 'Users', schema: UserSchema }])]
})
export class AuthModule { }
