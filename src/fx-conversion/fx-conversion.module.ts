import { Module } from '@nestjs/common';
import { FxConversionController } from './fx-conversion.controller';
import { FxConversionService } from './fx-conversion.service';
import { FxRatesModule } from 'src/fx-rates/fx-rates.module';
import { FxRatesService } from 'src/fx-rates/fx-rates.service';
import { HttpModule } from '@nestjs/axios';
import { AccountsService } from 'src/accounts/accounts.service';
import { AccountsModule } from 'src/accounts/accounts.module';
import { UserSchema } from 'src/schemas/users.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [HttpModule, AccountsModule, MongooseModule.forFeature([{ name: 'Users', schema: UserSchema },{ name: 'Accounts', schema: UserSchema }])],
  controllers: [FxConversionController],
  providers: [FxConversionService, FxRatesService, AccountsService]
})
export class FxConversionModule { }
