import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RateLimiterService } from './rate-limiter/rate-limiter.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const mockRateLimiterService = {
      allowRequest: jest.fn().mockResolvedValue(true),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        { provide: RateLimiterService, useValue: mockRateLimiterService },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Welcome! You are within the rate limit."', async () => {
      const mockReq = { ip: '127.0.0.1' } as any;
      await expect(appController.getHello(mockReq)).resolves.toBe(
        'Welcome! You are within the rate limit.',
      );
    });
  });
});
