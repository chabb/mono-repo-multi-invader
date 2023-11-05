import { Body, Controller, Get, Post } from '@nestjs/common';
import { GameConfigService } from '../game-config/game-config.service';
import {Config} from "@chabb/shared";
import {TurretService} from "../turret/turret.service";

@Controller('config')
export class ConfigController {
  constructor(private readonly gameConfigService: GameConfigService,
              private readonly turretService: TurretService) {}

  @Get()
  getConfig(): Config {
    return this.gameConfigService.getConfig();
  }

  @Post() updateConfig(@Body() configDTO: Partial<Config>): void {
    this.gameConfigService.updateConfig(configDTO);
    this.turretService.buildTurrets(); // FIXME should not happen if a game has started
  }
}

