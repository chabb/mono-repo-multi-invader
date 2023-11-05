import { Injectable, Logger } from '@nestjs/common';
import { Turret } from '@chabb/shared';
import { GameConfigService } from "../game-config/game-config.service";

@Injectable()
export class TurretService {

  private readonly log = new Logger();
  private turrets: Turret[] = [];
  constructor(private readonly gameConfigService: GameConfigService) {
    this.buildTurrets();
  }

  private makeTurret(): Turret {
    return {
      x: Math.floor(Math.random() * this.gameConfigService.getConfig().width),
      y: Math.floor(Math.random() * this.gameConfigService.getConfig().height),
      rotationSpeed: Math.random() * 0.5,
      firingRate: 40 + Math.floor(Math.random() * 30),
      rotation: Math.random() * Math.PI,
    };
  }

  private removeTurret(index: number) {
    this.turrets.splice(index, 1);
  }

  public getTurrets() {
    return [...this.turrets];
  }

  public buildTurrets(): void {
    this.log.log('CREATING TURRETS');
    this.turrets = [];
    for (let i = 0; i < this.gameConfigService.getConfig().turrets; i++) {
      this.turrets.push(this.makeTurret());
    }
    this.log.log(this.turrets);
  }
}
