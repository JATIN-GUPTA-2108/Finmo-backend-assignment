import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountSchema } from 'src/schemas/accounts.schema';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [MongooseModule.forFeature([{name: 'Accounts', schema: AccountSchema}]), AuthModule],
  providers: [AccountsService, AuthService],
  controllers: [AccountsController],
  exports: [MongooseModule.forFeature([{ name: 'Accounts', schema: AccountSchema }])]
})
export class AccountsModule {}
