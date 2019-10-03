"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const hbs = require("hbs");
const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
const yargs = require("yargs");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const better_sqlite3_1 = require("./common/better-sqlite3");
const error_filter_1 = require("./common/error.filter");
const mock_response_middleware_1 = require("./common/mock-response.middleware");
const argv = yargs
    .usage('Usage: $0 --https --db-path [path] --port [num]')
    .describe('db-path', 'Sqlite3 file path')
    .describe('https', 'is secure server')
    .describe('port', 'port number')
    .help('h').argv;
const config = getConfig(argv);
console.log('[mock-responses] yargs argv', argv, config);
if (!config.dbPath)
    throw `Invalid sqlite3 path ${argv['db-path']}`;
better_sqlite3_1.BetterSqlite3.initialize(config.dbPath);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        httpsOptions: config.httpsOptions
    });
    app.use(morgan('[mock-responses] :method :url :status :res[content-length] - :response-time ms'));
    app.useStaticAssets(path.join(__dirname, '..', 'assets'));
    app.use(mock_response_middleware_1.serveMockResponse);
    app.use(express.static(path.join(__dirname, '/assets')));
    app.setBaseViewsDir(__dirname);
    hbs.registerPartials(__dirname);
    app.setViewEngine('hbs');
    app.useGlobalFilters(new error_filter_1.ErrorFilter());
    await app.listen(config.port);
    console.log(`[mock-responses] starting server with port ${config.port}.`);
}
function getConfig(argv) {
    const config = {};
    const usrPath = path.resolve((argv['db-path']) || path.join(__dirname, '..', 'demo'));
    if (fs.existsSync(usrPath) && fs.lstatSync(usrPath).isDirectory()) {
        const dbPath = path.join(usrPath, 'mock-responses.sqlite3');
        config.dbPath = fs.existsSync(dbPath) ? dbPath : null;
    }
    else if (fs.existsSync(usrPath) && fs.lstatSync(usrPath).isFile()) {
        config.dbPath = usrPath;
    }
    config.port = parseInt(argv.port) || 3000;
    if (argv.secure) {
        const key = fs.readFileSync(path.join(__dirname, '..', 'demo', 'server.key'));
        const cert = fs.readFileSync(path.join(__dirname, '..', 'demo', 'server.cert'));
        config.httpsOptions = { key, cert };
    }
    return config;
}
bootstrap();
//# sourceMappingURL=main.js.map