"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const mock_responses_controller_1 = require("./mock-responses/mock-responses.controller");
const mock_responses_service_1 = require("./mock-responses/mock-responses.service");
const use_cases_service_1 = require("./use-cases/use-cases.service");
const use_cases_controller_1 = require("./use-cases/use-cases.controller");
let AppModule = class AppModule {
};
AppModule = __decorate([
    common_1.Module({
        controllers: [
            app_controller_1.AppController,
            mock_responses_controller_1.MockResponsesController,
            use_cases_controller_1.UseCasesController,
        ],
        providers: [
            mock_responses_service_1.MockResponsesService,
            use_cases_service_1.UseCasesService,
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map