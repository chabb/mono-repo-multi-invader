import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const log = new Logger();
  const app = await NestFactory.create(AppModule);
  log.log(`Configuration, TURRETS ${app.get(ConfigService).get('TURRETS')}`);
  log.log(`Configuration, WIDTH ${app.get(ConfigService).get('WIDTH')}`);
  log.log(`Configuration, HEIGHT ${app.get(ConfigService).get('HEIGHT')}`);
  log.log(`Configuration, MAXLIFE ${app.get(ConfigService).get('TURRETS')}`);
  await app.listen(app.get(ConfigService).get('PORT'));
}
bootstrap().then((r) => console.log('waiting....'));
