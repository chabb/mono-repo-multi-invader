import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { PlayersService } from '../players/players.service';

@Injectable()
export class UnRegisteredGuard implements CanActivate {
  constructor(private readonly playerService: PlayersService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const argumentsHost = context.switchToWs();
    const socket: Socket = argumentsHost.getClient();
    const data = argumentsHost.getData();
    console.log(socket.id, data.id, this.playerService.isActive(socket.id));
    return socket.id === data.id && !this.playerService.isActive(socket.id);
  }
}

//TODO(chab) use reflection to create a decorator with a boolean attribute
