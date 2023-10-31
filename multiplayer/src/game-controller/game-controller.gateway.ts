import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { PlayersService } from '../players/players.service';
import { UnRegisteredGuard } from '../register/unregister.guard';
import { RegisteredGuard } from '../register/register.guard';
import { Logger, UseGuards } from '@nestjs/common';
import { TurretService } from '../turret/turret.service';
import { Config } from '../config/config.controller';
import {GameConfigService} from "../game-config/game-config.service";

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GameControllerGateway
  implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect
{
  private readonly log = new Logger();
  private server: Server;

  constructor(
    private readonly turretService: TurretService,
    private readonly playerService: PlayersService,
    private readonly confServe: GameConfigService,
  ) {}
  @UseGuards(UnRegisteredGuard)
  @SubscribeMessage('register')
  handleRegistration(
    @MessageBody('id') id: string,
    @ConnectedSocket() socket: Socket,
  ): void {
    this.log.log(`new player registration ${id}`);
    socket.emit('registered', { id: socket.id }, () => {
      this.log.log(`player ${socket.id} connected`);
      const player = this.playerService.createPlayer(id);
      this.log.debug(
        'current number of player',
        this.playerService.getPlayers().length,
      );

      if (this.playerService.getPlayers().length >= 1) {
        // TODO RANDOMIZE WHICH PLAYER WILL BE USED
        const id = this.playerService.getPlayers()[0];
        this.log.warn(`Retrieving current state from the first player ${id}`);
        this.server.sockets.sockets
          .get(id)
          .emit('getState', { id }, (tanks) => {
            this.log.log('[GET STATE] tanks', tanks);
            // TODO simplify
            socket.emit(
              'state',
              {
                turrets: this.turretService.getTurrets(),
                playerTank: player,
                player: this.playerService.getPlayers().length,
                playerTanks: tanks,
              },
              () => {
                this.log.log(`game state sent to ${socket.id}`);
                this.playerService.addPlayer(player);
                this.log.log(
                  `we now have ${this.playerService.numberOfPlayers()} players`,
                );
                this.playerService.getPlayers().forEach((playerId) => {
                  if (playerId !== socket.id) {
                    this.log.log('sending new player state');
                    this.server.sockets.sockets
                      .get(playerId)
                      .emit(
                        'player',
                        {
                          id: socket.id,
                          index: this.playerService.getPlayers().length,
                          player,
                        },
                        () => {
                          this.log.log(
                            `player ${playerId} info sent to player`,
                            socket.id,
                          );
                        },
                      );
                  }
                });
              },
            );
          });
      } else {
        this.log.warn('FIRST PLAYER REGISTERED');
        this.playerService.addPlayer(player);
        socket.emit(
          'state',
          {
            turrets: this.turretService.getTurrets(),
            playerTank: player,
            player: this.playerService.getPlayers().length,
            playerTanks: [],
          },
          () => this.log.log(`game state sent to ${socket.id}`),
        );
      }
    });
  }

  @SubscribeMessage('config')
  getConfig(): Config {
      return this.confServe.getConfig();
  }

  @UseGuards(RegisteredGuard)
  @SubscribeMessage('stop')
  stop(@MessageBody('id') id: string, @ConnectedSocket() socket: Socket): void {
    this.playerService.getPlayers().forEach((playerId) => {
      if (playerId !== socket.id) {
        this.log.log('[stop] sending new player state');
        this.server.sockets.sockets.get(playerId).emit('stop', { id });
      }
    });
  }

  @UseGuards(RegisteredGuard)
  @SubscribeMessage('forward')
  handleEvents(
    @MessageBody('id') id: string,
    @ConnectedSocket() socket: Socket,
  ): void {
    this.playerService.getPlayers().forEach((playerId) => {
      if (playerId !== socket.id) {
        this.log.log(
          `[moveForward] sending new player state from ${id} to ${playerId}`,
        );
        this.server.sockets.sockets.get(playerId).emit('forward', { id });
      }
    });
  }

  @UseGuards(RegisteredGuard)
  @SubscribeMessage('rotateRight')
  rotateRight(
    @MessageBody('id') id: string,
    @ConnectedSocket() socket: Socket,
  ): void {
    this.playerService.getPlayers().forEach((playerId) => {
      if (playerId !== socket.id) {
        this.log.log('[rotateRight] sending new player state');
        this.server.sockets.sockets.get(playerId).emit('rotateRight', { id });
      }
    });
  }

  @UseGuards(RegisteredGuard)
  @SubscribeMessage('rotateLeft')
  rotateLeft(
    @MessageBody('id') id: string,
    @ConnectedSocket() socket: Socket,
  ): void {
    this.playerService.getPlayers().forEach((playerId) => {
      if (playerId !== socket.id) {
        this.log.log('[rotateLeft] sending new player state');
        this.server.sockets.sockets.get(playerId).emit('rotateLeft', { id });
      }
    });
  }

  @UseGuards(RegisteredGuard)
  @SubscribeMessage('stopRotation')
  stopRotation(
    @MessageBody('id') id: string,
    @ConnectedSocket() socket: Socket,
  ): void {
    this.playerService.getPlayers().forEach((playerId) => {
      if (playerId !== socket.id) {
        this.log.log('[stopRotation] sending new player state');
        this.server.sockets.sockets.get(playerId).emit('stopRotation', { id });
      }
    });
  }

  @UseGuards(RegisteredGuard)
  @SubscribeMessage('fireBullet')
  fireBullet(
    @MessageBody('id') id: string,
    @ConnectedSocket() socket: Socket,
  ): void {
    this.playerService.getPlayers().forEach((playerId) => {
      if (playerId !== socket.id) {
        this.log.log('[fireBullet] sending new player state');
        this.server.sockets.sockets.get(playerId).emit('fireBullet', { id });
      }
    });
  }

  afterInit(server: Server): void {
    this.log.warn('Server started, config : ', server._opts);
    this.server = server;
  }

  handleConnection(socket: Socket): void {
    this.log.log('Client connecting...', socket.id);
  }

  handleDisconnect(socket: Socket): void {
    this.log.warn(` Client ${socket.id} disconnected`);
    this.playerService.removePlayer(socket.id);
    socket.emit('playerDisconnect', { id: socket.id });
  }
}
