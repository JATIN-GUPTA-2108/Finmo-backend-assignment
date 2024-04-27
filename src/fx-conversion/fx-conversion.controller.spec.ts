import { Test, TestingModule } from '@nestjs/testing';
import { FxConversionController } from './fx-conversion.controller';

describe('FxConversionController', () => {
  let controller: FxConversionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FxConversionController],
    }).compile();

    controller = module.get<FxConversionController>(FxConversionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
