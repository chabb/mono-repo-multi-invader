import { Test, TestingModule } from '@nestjs/testing';
import { GameControllerGateway } from './game-controller.gateway';

describe('GameControllerGateway', () => {
  let gateway: GameControllerGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameControllerGateway],
    }).compile();

    gateway = module.get<GameControllerGateway>(GameControllerGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
