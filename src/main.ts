import * as path from 'path';
import * as hbs from 'hbs';
import * as express from 'express';
import * as morgan from 'morgan';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';
import { BetterSqlite3 } from './common/better-sqlite3';
import { ErrorFilter } from './common/error.filter';

import { serveMockResponse } from './common/mock-response.middleware';

BetterSqlite3.initialize(path.resolve('demo/mock-responses.sqlite3'));

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(morgan('[mock-responses] :method :url :status :res[content-length] - :response-time ms'));
  app.useStaticAssets(path.join(__dirname, '..', 'assets')); // TODO is it necessary?
  app.use(serveMockResponse);
  app.use(express.static(path.join(__dirname, '/assets')));

  app.setBaseViewsDir(__dirname);

  hbs.registerPartials(__dirname); // TODO is it necessary?

  app.setViewEngine('hbs');        // TODO is it necessary?
  app.useGlobalFilters(new ErrorFilter())

  await app.listen(3000);
  console.log('[mock-responses] starting server with port 3000. e.g. http://localhost:3000');
}
bootstrap();