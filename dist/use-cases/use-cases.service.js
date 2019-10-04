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
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const better_sqlite3_1 = require("../common/better-sqlite3");
const mock_responses_service_1 = require("../mock-responses/mock-responses.service");
let UseCasesService = class UseCasesService {
    constructor(mockResp) {
        this.mockResp = mockResp;
        this.db = better_sqlite3_1.BetterSqlite3.db;
    }
    create(data) {
        const name = data.name.trim().replace(/'/g, '\'\'');
        const description = data.description.trim().replace(/'/g, '\'\'');
        const mockResponses = data.mock_responses.trim().replace(/'/g, '\'\'');
        ;
        const sql = `
      INSERT INTO use_cases 
        (name, description, mock_responses)
        VALUES ('${name}', '${description}', '${mockResponses}');
      `;
        console.log('[mock-responses] UseCaseService use_cases create', sql);
        if (this.db.exec(sql)) {
            better_sqlite3_1.BetterSqlite3.backupToSql();
        }
        else {
            throw '[mock-responses] error create use_cases';
        }
    }
    find(id) {
        const row = this.db.prepare(`SELECT * FROM use_cases WHERE id = ${id}`);
        return row.get();
    }
    findAll(key) {
        const whereSql = key ?
            `name like '%${key}%' OR description like '%${key}%'` : `1=1`;
        const sql = `SELECT * FROM use_cases WHERE ${whereSql}`;
        console.log('[mock-responses] UseCaseService', sql);
        return this.db.prepare(sql).all();
    }
    update(data) {
        const name = data.name.trim().replace(/'/g, '\'\'');
        const description = data.description.trim().replace(/'/g, '\'\'');
        const mockResponses = data.mock_responses.trim().replace(/'/g, '\'\'');
        ;
        const sql = `
      UPDATE use_cases SET
        name = '${name}',
        description = '${description}',
        mock_responses = '${mockResponses}'
      WHERE id = ${data.id};
      `;
        console.log('[mock-responses] UseCaseService', sql);
        const result = this.db.exec(sql);
        if (this.db.exec(sql)) {
            better_sqlite3_1.BetterSqlite3.backupToSql();
        }
        else {
            throw '[mock-responses] error update use_cases';
        }
    }
    delete(id) {
        const sql = `DELETE FROM use_cases where id=${id}`;
        console.log('[mock-responses] UseCaseService', sql);
        const result = this.db.exec(sql);
        if (this.db.exec(sql)) {
            better_sqlite3_1.BetterSqlite3.backupToSql();
        }
        else {
            throw '[mock-responses] error delete use_cases';
        }
    }
    activate(id) {
        const useCase = this.find(id);
        const mockRespIds = useCase.mock_responses.split(',').map(el => parseInt(el));
        console.log('[mock-responses] UseCaseService activate mock_responses with ids', mockRespIds);
        const mockResponses = this.mockResp.findByIds(mockRespIds);
        mockResponses.forEach(mockResp => {
            this.mockResp.activate(mockResp.id);
        });
    }
};
UseCasesService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [mock_responses_service_1.MockResponsesService])
], UseCasesService);
exports.UseCasesService = UseCasesService;
//# sourceMappingURL=use-cases.service.js.map