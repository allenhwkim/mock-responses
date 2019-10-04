"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const hbs = require("hbs");
const fs = require("fs");
const yargs = require("yargs");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const better_sqlite3_1 = require("./common/better-sqlite3");
const error_filter_1 = require("./common/error.filter");
const mock_response_middleware_1 = require("./common/mock-response.middleware");
const argv = yargs
    .usage('Usage: $0 --https --db-path [path] --port [num] --assets')
    .describe('db-path', 'Sqlite3 file path')
    .describe('ssl', 'run https server')
    .describe('port', 'port number')
    .describe('cookie', 'response cookie value')
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
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(cors());
    if (argv.cookie) {
        app.use(function (req, res, next) {
            const [_, name, value] = argv.cookie.match(/^([a-z_]+)=(.*)/i);
            console.log('>>>>>>>>> cookieSession', { name, value });
            if (!req.cookies[name]) {
                res.setHeader('Set-Cookie', `${name}=${value}`);
            }
            next();
            return;
        });
    }
    app.use(mock_response_middleware_1.serveMockResponse);
    app.use(express.static(path.join(__dirname, 'assets')));
    app.setBaseViewsDir(path.join(__dirname, 'assets', 'views'));
    hbs.registerPartials(path.join(__dirname, 'assets', 'views'));
    app.setViewEngine('hbs');
    app.useGlobalFilters(new error_filter_1.ErrorFilter());
    await app.listen(config.port);
    console.log(`[mock-responses] starting server with port ${config.port}.`);
}
function getConfig(argv) {
    const config = {};
    const demoPath1 = path.join(__dirname, 'demo');
    const demoPath2 = path.join(__dirname, '..', 'demo');
    const demoDirPath = (fs.existsSync(demoPath1) && demoPath1) || (fs.existsSync(demoPath2) && demoPath2) || path.join(__dirname);
    const usrPath = path.resolve((argv['db-path']) || demoDirPath);
    if (fs.existsSync(usrPath) && fs.lstatSync(usrPath).isDirectory()) {
        const dbPath = path.join(usrPath, 'mock-responses.sqlite3');
        config.dbPath = fs.existsSync(dbPath) ? dbPath : null;
    }
    else if (fs.existsSync(usrPath) && fs.lstatSync(usrPath).isFile()) {
        config.dbPath = usrPath;
    }
    config.port = parseInt(argv.port) || 3000;
    if (argv.ssl) {
        const key = fs.readFileSync(path.join(__dirname, '..', 'demo', 'server.key'));
        const cert = fs.readFileSync(path.join(__dirname, '..', 'demo', 'server.cert'));
        config.httpsOptions = { key, cert };
    }
    return config;
}
bootstrap();
//# sourceMappingURL=main.js.map