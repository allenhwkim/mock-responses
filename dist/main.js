"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const hbs = require("hbs");
const express = require("express");
const morgan = require("morgan");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const better_sqlite3_1 = require("./common/better-sqlite3");
const error_filter_1 = require("./common/error.filter");
const mock_response_middleware_1 = require("./common/mock-response.middleware");
better_sqlite3_1.BetterSqlite3.initialize(path.resolve('demo/mock-responses.sqlite3'));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use(morgan('[mock-responses] :method :url :status :res[content-length] - :response-time ms'));
    app.useStaticAssets(path.join(__dirname, '..', 'assets'));
    app.use(mock_response_middleware_1.serveMockResponse);
    app.use(express.static(path.join(__dirname, '/assets')));
    app.setBaseViewsDir(__dirname);
    hbs.registerPartials(__dirname);
    app.setViewEngine('hbs');
    app.useGlobalFilters(new error_filter_1.ErrorFilter());
    await app.listen(3000);
    console.log('[mock-responses] starting server with port 3000. e.g. http://localhost:3000');
}
bootstrap();
//# sourceMappingURL=main.js.map