import { Body, Controller, Get, Post } from '@nestjs/common';
import { GameConfigService } from '../game-config/game-config.service';
import {Config} from "@chabb/shared";

@Controller('config')
export class ConfigController {
  constructor(private readonly gameConfigService: GameConfigService) {}

  @Get()
  getConfig(): Config {
    return this.gameConfigService.getConfig();
  }

  @Post() updateConfig(@Body() configDTO: Partial<Config>): void {
    this.gameConfigService.updateConfig(configDTO);
  }
}

