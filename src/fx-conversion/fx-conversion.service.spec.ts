import { Test, TestingModule } from '@nestjs/testing';
import { FxConversionService } from './fx-conversion.service';

describe('FxConversionService', () => {
  let service: FxConversionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FxConversionService],
    }).compile();

    service = module.get<FxConversionService>(FxConversionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
