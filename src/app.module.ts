import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { RateLimiterModule } from './rate-limiter/rate-limiter.module';

@Module({
  imports: [ConfigModule.forRoot(), RateLimiterModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
