#!/usr/bin/env node
import * as path from 'path';
import * as fs from 'fs';
import * as yargs from 'yargs';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';
import { BetterSqlite3 } from './common/better-sqlite3';
import { ErrorFilter } from './common/error.filter';
import { serveMockResponse } from './common/mock-response.middleware';

const argv = yargs
  .usage(
    `Usage: $0 --dbPath [path] --port [num]` +
    ` --cookie='MY_SESSION=123456789; Path=/'` +
    ` --headers='Access-Control-Allow-Headers=Content-Type, Authorization, X-Requested-With' `
  )
  .option('config', {type:'string', describe: 'config file path'})
  .option('dbPath', {type: 'string', describe: 'Sqlite3 file path'})
  .option('ssl', {type:'boolean', default: false, describe: 'run https server'})
  .option('sslKeyPath', {type:'string', describe: 'ssl key file. e.g. server.key'})
  .option('sslCertPath', {type:'string', describe: 'ssl cert file. e.g. server.cert'})
  .option('port', {describe: 'port number'})
  .option('cookie', {type: 'string', describe: 'response cookie value'})
  .option('headers', {type: 'array', desc: 'One or more custom headers'})
  .help('h').argv;

function getConfig(argv: any) {
  const defaultConfigPath = path.join(process.cwd(), 'mock-responses.config.js');
  const configFile = path.resolve(argv.config || defaultConfigPath);

  // if config not exists, create one
  if (fs.existsSync(configFile)) {
    console.log('[mock-responses] config file defined', { defaultConfigPath, argument: argv.config }, configFile);
  } else {
    console.error('[mock-responses] config file NOT found. Creating one');
    const configFileContents =`module.exports = {\n  dbPath: './mock-responses.sql',\n   port: 3331\n};`;
    fs.writeFileSync('mock-responses.config.js', configFileContents, 'utf8');
  }
  const config  = require(configFile);

  // if dbPath not exists, create one
  if (!fs.existsSync(config.dbPath) || !fs.lstatSync(config.dbPath).isFile()) {
    console.error(`Invalid sqlite3 path ${config.dbPath}, creating one`);
    const demoSql = fs.readFileSync(path.resolve(
      path.join(__dirname, '..', 'demo', 'mock-responses.sql')
    ));
    fs.writeFileSync('mock-responses.sql', demoSql, 'utf8');
  }

  ['dbPath', 'ssl', 'sslKeyPath', 'sslCertPath', 'port', 'cookie', 'headers']
    .forEach( key => argv[key] && (config[key] = argv[key]) );

  if (config.ssl) {
    if (config.sslCertPath && config.sslKeyPath) {
      config.httpsOptions = {
        key: fs.readFileSync(path.resolve(config.sslKeyPath)),
        cert: fs.readFileSync(path.resolve(config.sslCertPath))
      };
    } else {
      const sslKey = fs.readFileSync(path.join(__dirname, './server.key'));
      const sslCert = fs.readFileSync(path.join(__dirname, './server.cert'));
      config.httpsOptions = { key: sslKey, cert: sslCert };
    }
  }

  // if dbPath not exists, exit with error
  if (!fs.existsSync(config.dbPath) || !fs.lstatSync(config.dbPath).isFile()) {
    console.error(`Invalid sqlite3 path ${config.dbPath}`);
    process.exit(1);
  }

  return config;
}

async function bootstrap(config) {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    httpsOptions: config.httpsOptions
  });

  // for request, log calls
  app.use(morgan('[mock-responses] :method :url :status :res[content-length] - :response-time ms'));
  // for request, parse http post/put body json, and provide as req.body
  app.use(bodyParser.json({limit: '50mb'}));
  // for request, max post/put body size to 50mb
  app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
  // fore request, parse cookie and provide it as req.cookies
  app.use(cookieParser());
  // fore response, set response CORS headers, custom headers, custom cookies
  app.use( function(req, res, next) { 
    const origin = req.headers['origin'];
    if (origin) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT, OPTIONS');
      res.setHeader('Access-Control-Allow-Credentials', true);
    }

    res.setHeader('Surrogate-Control', 'no-store');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    // ser custom headers
    if (config.headers) {
      config.headers.forEach((header: string) => {
        const [key, value] = header.split('=');
        value && res.setHeader(key, value);
      })
    }

    // set custom cookies
    if (config.cookie) {
      const [_, name, value] = config.cookie.match(/^([a-z_]+)=(.*)/i);
      if (!req.cookies[name]) {
        res.setHeader('Set-Cookie', `${name}=${value}`);
      }
    }

    next();
    return;
  });

  // serve mock responses
  app.use(serveMockResponse);
  // serve errors
  app.useGlobalFilters(new ErrorFilter()) // handle errors

  await app.listen(config.port);
  console.log(`[mock-responses] starting server with port ${config.port}.`);
}

const config = getConfig(argv || 3331);
console.log('[mock-responses] yargs argv', config);
BetterSqlite3.initialize(config.dbPath);

bootstrap(config);
