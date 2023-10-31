import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameControllerGateway } from './game-controller/game-controller.gateway';
import { PlayersService } from './players/players.service';
import { ConfigModule } from '@nestjs/config';
import { TurretService } from './turret/turret.service';
import { ConfigController } from './config/config.controller';
import { GameConfigService } from './game-config/game-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController, ConfigController],
  providers: [
    AppService,
    GameControllerGateway,
    PlayersService,
    TurretService,
    GameConfigService,
  ],
})
export class AppModule {}
