import { Injectable } from '@nestjs/common';
import { Player } from './player.interface';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import { getBulletColor } from './bulet-color';
import { getPlayerColor } from './player-color';

@Injectable()
export class PlayersService {
  constructor(private readonly conf: ConfigService) {}

  private players: { [id: string]: Player } = {};

  numberOfPlayers(): number {
    return this.getPlayers().length;
  }

  getPlayers(): string[] {
    return Object.keys(this.players);
  }

  isActive(id: string): boolean {
    return !!this.players[id];
  }

  addPlayer(player: Player): void {
    this.players[player.id] = player;
  }

  createPlayer(id): Player {
    let offsetDirection = Math.random() > 0.5 ? 1 : -1;
    let numberOfPlayets = this.numberOfPlayers();
    return {
      lifePoint: this.conf.get('MAXLIFE'),
      id,
      bulletColor: getBulletColor(),
      playerColor: getPlayerColor(),
      x: 300 + numberOfPlayets * 50 * offsetDirection,
      y: 300 + numberOfPlayets * 50 * offsetDirection,
    };
  }

  removePlayer(id: string): void {
    delete this.players[id];
  }
}
