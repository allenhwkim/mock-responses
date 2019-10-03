import * as path from 'path';
import * as hbs from 'hbs';
import * as express from 'express';
import * as morgan from 'morgan';
import * as fs from 'fs';
import * as yargs from 'yargs';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';
import { BetterSqlite3 } from './common/better-sqlite3';
import { ErrorFilter } from './common/error.filter';

import { serveMockResponse } from './common/mock-response.middleware';

const argv = yargs
  .usage('Usage: $0 --https --db-path [path] --port [num]')
  .describe('db-path', 'Sqlite3 file path')
  .describe('https', 'is secure server')
  .describe('port', 'port number')
  .help('h').argv;
const config = getConfig(argv);
console.log('[mock-responses] yargs argv', argv, config);
if (!config.dbPath) throw `Invalid sqlite3 path ${argv['db-path']}`;
BetterSqlite3.initialize(config.dbPath);

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    httpsOptions: config.httpsOptions
  });

  app.use(morgan('[mock-responses] :method :url :status :res[content-length] - :response-time ms'));
  app.useStaticAssets(path.join(__dirname, '..', 'assets'));
  app.use(serveMockResponse);
  app.use(express.static(path.join(__dirname, '/assets')));

  app.setBaseViewsDir(__dirname);
  hbs.registerPartials(__dirname); 

  app.setViewEngine('hbs');
  app.useGlobalFilters(new ErrorFilter())

  await app.listen(config.port);
  console.log(`[mock-responses] starting server with port ${config.port}.`);
}

function getConfig(argv) {
  const config: any = {};

  const usrPath = path.resolve(<string>(argv['db-path']) || path.join(__dirname, '..', 'demo'));
  if (fs.existsSync(usrPath) && fs.lstatSync(usrPath).isDirectory()) {
    const dbPath = path.join(usrPath, 'mock-responses.sqlite3');
    config.dbPath = fs.existsSync(dbPath) ? dbPath : null;
  } else if (fs.existsSync(usrPath) && fs.lstatSync(usrPath).isFile()) {
    config.dbPath = usrPath;
  }

  config.port = parseInt(<any>argv.port) || 3000;

  if (argv.secure) {
    const key = fs.readFileSync(path.join(__dirname, '..', 'demo', 'server.key'))
    const cert = fs.readFileSync(path.join(__dirname, '..', 'demo', 'server.cert'))
    config.httpsOptions = {key, cert};
  }

  return config;
}

bootstrap();
