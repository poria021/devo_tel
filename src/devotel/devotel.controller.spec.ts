import { Test, TestingModule } from '@nestjs/testing';
import { DevotelController } from './devotel.controller';

describe('DevotelController', () => {
  let controller: DevotelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DevotelController],
    }).compile();

    controller = module.get<DevotelController>(DevotelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
