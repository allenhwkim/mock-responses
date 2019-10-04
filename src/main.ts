import * as path from 'path';
import * as hbs from 'hbs';
import * as fs from 'fs';
import * as yargs from 'yargs';

import * as express from 'express';
import * as cors from 'cors';
// import * as cookieSession from 'cookie-session';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import * as cookieParser from 'cookie-parser';

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';
import { BetterSqlite3 } from './common/better-sqlite3';
import { ErrorFilter } from './common/error.filter';

import { serveMockResponse } from './common/mock-response.middleware';


const argv = yargs
  .usage('Usage: $0 --https --db-path [path] --port [num] --assets')
  .describe('db-path', 'Sqlite3 file path')
  .describe('ssl', 'run https server')
  .describe('port', 'port number')
  .describe('cookie', 'response cookie value')
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
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(cors());
  if (argv.cookie) {
    app.use( function(req, res, next) { 
      const [_, name, value] = (<string>argv.cookie).match(/^([a-z_]+)=(.*)/i);
      console.log('>>>>>>>>> cookieSession', { name, value });
      if (!req.cookies[name]) {
        res.setHeader('Set-Cookie', `${name}=${value}`);
      }
      next();
      return;
    });
  }
  app.use(serveMockResponse);
  app.use(express.static(path.join(__dirname, 'assets')));

  // app.useStaticAssets(path.join(__dirname, 'assets'));
  app.setBaseViewsDir(path.join(__dirname, 'assets', 'views')); // views for nestjs
  hbs.registerPartials(path.join(__dirname, 'assets', 'views'));  // views for hbs

  app.setViewEngine('hbs');
  app.useGlobalFilters(new ErrorFilter())

  await app.listen(config.port);
  console.log(`[mock-responses] starting server with port ${config.port}.`);
}

function getConfig(argv) {
  const config: any = {};
  const demoPath1 = path.join(__dirname, 'demo');
  const demoPath2 = path.join(__dirname, '..', 'demo');
  const demoDirPath = 
    (fs.existsSync(demoPath1) && demoPath1) || (fs.existsSync(demoPath2) && demoPath2) || path.join(__dirname);

  const usrPath = path.resolve(<string>(argv['db-path']) || demoDirPath);
  if (fs.existsSync(usrPath) && fs.lstatSync(usrPath).isDirectory()) {
    const dbPath = path.join(usrPath, 'mock-responses.sqlite3');
    config.dbPath = fs.existsSync(dbPath) ? dbPath : null;
  } else if (fs.existsSync(usrPath) && fs.lstatSync(usrPath).isFile()) {
    config.dbPath = usrPath;
  }

  config.port = parseInt(<any>argv.port) || 3000;

  if (argv.ssl) {
    const key = fs.readFileSync(path.join(__dirname, '..', 'demo', 'server.key'))
    const cert = fs.readFileSync(path.join(__dirname, '..', 'demo', 'server.cert'))
    config.httpsOptions = {key, cert};
  }

  return config;
}

bootstrap();
