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
const use_cases_service_1 = require("./use-cases.service");
const mock_responses_service_1 = require("../mock-responses/mock-responses.service");
let UseCasesController = class UseCasesController {
    constructor(useCase, mockResp) {
        this.useCase = useCase;
        this.mockResp = mockResp;
    }
    edit(params) {
        const useCase = this.useCase.find(params.id);
        const mockRespIds = useCase.mock_responses.split(',').map(id => parseInt(id));
        const mockResponses = this.mockResp.findByIds(mockRespIds);
        return { useCase, mockResponses };
    }
    new(params) {
        const useCase = { id: undefined, name: '', description: '', mock_responses: '' };
        const mockResponses = [];
        return { useCase, mockResponses };
    }
    findAll(key) {
        return this.useCase.findAll(key);
    }
    findOne(params) {
        return this.useCase.find(params.id);
    }
    create(data) {
        return this.useCase.create(data);
    }
    activate(params) {
        return this.useCase.activate(params.id);
    }
    update(data) {
        return this.useCase.update(data);
    }
    delete(params) {
        return this.useCase.delete(params.id);
    }
};
__decorate([
    common_1.Get('edit/:id'),
    common_1.Render('use-cases/edit'),
    __param(0, common_1.Param()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UseCasesController.prototype, "edit", null);
__decorate([
    common_1.Get('new'),
    common_1.Render('use-cases/edit'),
    __param(0, common_1.Param()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UseCasesController.prototype, "new", null);
__decorate([
    common_1.Get(),
    __param(0, common_1.Query('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", String)
], UseCasesController.prototype, "findAll", null);
__decorate([
    common_1.Get(':id'),
    __param(0, common_1.Param()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", String)
], UseCasesController.prototype, "findOne", null);
__decorate([
    common_1.Post(),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UseCasesController.prototype, "create", null);
__decorate([
    common_1.Put(':id/activate'),
    __param(0, common_1.Param()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UseCasesController.prototype, "activate", null);
__decorate([
    common_1.Put(':id'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UseCasesController.prototype, "update", null);
__decorate([
    common_1.Delete(':id'),
    __param(0, common_1.Param()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UseCasesController.prototype, "delete", null);
UseCasesController = __decorate([
    common_1.Controller('use-cases'),
    __metadata("design:paramtypes", [use_cases_service_1.UseCasesService,
        mock_responses_service_1.MockResponsesService])
], UseCasesController);
exports.UseCasesController = UseCasesController;
//# sourceMappingURL=use-cases.controller.js.map