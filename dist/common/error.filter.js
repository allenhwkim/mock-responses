"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
let ErrorFilter = class ErrorFilter {
    catch(error, host) {
        let req = host.switchToHttp().getRequest();
        let res = host.switchToHttp().getResponse();
        let status = (error instanceof common_1.HttpException) ? error.getStatus() : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        if (status === common_1.HttpStatus.UNAUTHORIZED) {
            return res.status(status).send('');
        }
        else if (status === common_1.HttpStatus.NOT_FOUND) {
            return res.status(status).send('');
        }
        else if (status === common_1.HttpStatus.INTERNAL_SERVER_ERROR) {
            return res.status(status).send(`<pre>${error.stack}</pre>`);
        }
        else {
            return res.status(status).send(`<pre>${error.stack}</pre>`);
        }
    }
};
ErrorFilter = __decorate([
    common_1.Catch()
], ErrorFilter);
exports.ErrorFilter = ErrorFilter;
//# sourceMappingURL=error.filter.js.map