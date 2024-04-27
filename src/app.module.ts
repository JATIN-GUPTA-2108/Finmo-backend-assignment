import { Module, NestModule, MiddlewareConsumer, RequestMethod, DynamicModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountsModule } from './accounts/accounts.module';
import { LoggerMiddleware } from './logger/logger.middleware';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { FxRatesModule } from './fx-rates/fx-rates.module';
import configuration from './config/configuration';
import { CacheModule } from '@nestjs/cache-manager';
import { FxConversionModule } from './fx-conversion/fx-conversion.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [configuration]}),
    MongooseModule.forRoot(configuration().DATABASE_URL), 
    AccountsModule, 
    AuthModule, 
    FxRatesModule,
    CacheModule.register(),
    FxConversionModule,
    UsersModule
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
