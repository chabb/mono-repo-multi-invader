import { Test, TestingModule } from '@nestjs/testing';
import { TurretService } from './turret.service';

describe('TurretService', () => {
  let service: TurretService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TurretService],
    }).compile();

    service = module.get<TurretService>(TurretService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
