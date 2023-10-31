import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { PlayersService } from '../players/players.service';

@Injectable()
export class RegisteredGuard implements CanActivate {
  constructor(private readonly playerService: PlayersService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const argumentsHost = context.switchToWs();
    const socket: Socket = argumentsHost.getClient();
    const data = argumentsHost.getData();
    return socket.id === data.id && this.playerService.isActive(socket.id);
  }
}
