import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config } from '../config/config.controller';

@Injectable()
export class GameConfigService {
  private config: Config = {
    width: parseInt(this.confServe.get('WIDTH')),
    height: parseInt(this.confServe.get('HEIGHT')),
    maxLife: parseInt(this.confServe.get('MAXLIFE')),
    turrets: parseInt(this.confServe.get('TURRETS')),
  };
  constructor(private readonly confServe: ConfigService) {}

  getConfig(): Config {
    return this.config;
  }
  updateConfig(config: Partial<Config>) {
    this.config = { ...this.config, ...config };
  }
}
