"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const mock_responses_service_1 = require("./mock-responses.service");
let MockResponsesController = class MockResponsesController {
    constructor(mockResp) {
        this.mockResp = mockResp;
    }
    index(key) {
        const mockResponses = this.mockResp.findAll(key);
        return { mockResponses };
    }
    edit(params) {
        const mockResponse = this.mockResp.find(params.id);
        return { mockResponse };
    }
    new(params) {
        return {
            mockResponse: {
                name: '',
                active: false,
                req_url: '',
                req_method: 'POST',
                req_payload: '',
                res_status: 200,
                res_delay_sec: 0,
                res_content_type: 'application/json',
                res_body: ''
            }
        };
    }
    findAll(key) {
        return this.mockResp.findAll(key);
    }
    findOne(params) {
        return this.mockResp.find(params.id);
    }
    create(data, res) {
        return this.mockResp.create(data);
    }
    update(data) {
        return this.mockResp.update(data);
    }
    activate(params) {
        return this.mockResp.activate(params.id);
    }
    delete(params) {
        return this.mockResp.delete(params.id);
    }
};
__decorate([
    common_1.Get('index'),
    common_1.Render('mock-responses-list'),
    __param(0, common_1.Query('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MockResponsesController.prototype, "index", null);
__decorate([
    common_1.Get('edit/:id'),
    common_1.Render('mock-responses-edit'),
    __param(0, common_1.Param()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MockResponsesController.prototype, "edit", null);
__decorate([
    common_1.Get('new'),
    common_1.Render('mock-responses-edit'),
    __param(0, common_1.Param()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MockResponsesController.prototype, "new", null);
__decorate([
    common_1.Get(),
    __param(0, common_1.Query('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", String)
], MockResponsesController.prototype, "findAll", null);
__decorate([
    common_1.Get(':id'),
    __param(0, common_1.Param()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", String)
], MockResponsesController.prototype, "findOne", null);
__decorate([
    common_1.Post(),
    __param(0, common_1.Body()), __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], MockResponsesController.prototype, "create", null);
__decorate([
    common_1.Put(':id'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MockResponsesController.prototype, "update", null);
__decorate([
    common_1.Put(':id/activate'),
    __param(0, common_1.Param()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MockResponsesController.prototype, "activate", null);
__decorate([
    common_1.Delete(':id'),
    __param(0, common_1.Param()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MockResponsesController.prototype, "delete", null);
MockResponsesController = __decorate([
    common_1.Controller('mock-responses'),
    __metadata("design:paramtypes", [mock_responses_service_1.MockResponsesService])
], MockResponsesController);
exports.MockResponsesController = MockResponsesController;
//# sourceMappingURL=mock-responses.controller.js.map