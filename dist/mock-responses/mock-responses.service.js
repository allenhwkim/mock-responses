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
const username = require("username");
const common_1 = require("@nestjs/common");
const better_sqlite3_1 = require("../common/better-sqlite3");
function getJSON(data) {
    try {
        return JSON.stringify(JSON.parse(data.res_doby), null, '  ');
    }
    catch (e) {
    }
    return data.replace(/'/g, '\'\'');
}
function getWhereFromBy(by) {
    const res = [];
    by.active && res.push(`active = ${by.active}`);
    by.url && res.push(`req_url = '${by.url}'`);
    by.method && res.push(`req_method = '${by.method}'`);
    by.payload && res.push(`req_payload LIKE '%${by.payload}%'`);
    by.status && res.push(`req_status = ${by.status}`);
    by.delay_sec && res.push(`req_delay_sec = ${by.delay_sec}`);
    by.content_type && res.push(`req_content_type = ${by.content_type}`);
    const where = res.length ? res.join(' AND ') : '1=1';
    return where;
}
let MockResponsesService = class MockResponsesService {
    constructor() {
        this.db = better_sqlite3_1.BetterSqlite3.db;
    }
    create(data) {
        const createdAt = new Date().getTime();
        const reqMethod = data.req_method ? `'${data.req_method}'` : 'NULL';
        const reqName = data.name ? `'${data.name}'` : 'NULL';
        const resDelaySec = data.res_delay_sec ? data.res_delay_sec : 'NULL';
        const resBody = getJSON(data.res_body);
        const sql = `
      INSERT INTO mock_responses(name, active,
        req_url, req_method, req_payload,
        res_status, res_delay_sec,
        res_content_type, res_body,
        created_at, created_by, updated_at, updated_by
        ) VALUES
        (
         ${reqName}, ${data.active || 0},
        '${data.req_url}', ${reqMethod}, '${data.req_payload}',
         ${data.res_status}, ${resDelaySec},
        '${data.res_content_type}', '${resBody}',
         ${createdAt}, '${username.sync()}', ${createdAt}, '${username.sync()}'
        )
      `;
        console.log('[mock-responses] MockResponseService create', sql);
        if (this.db.exec(sql)) {
            better_sqlite3_1.BetterSqlite3.backupToSql();
        }
        else {
            throw '[mock-responses] error create mock_responses';
        }
    }
    find(id) {
        const row = this.db.prepare(`SELECT * FROM mock_responses WHERE id = ${id}`);
        return row.get();
    }
    findAll(key) {
        const whereSql = key ?
            `name like '%${key}%' OR req_url like '%${key}%' OR res_body like '%${key}%'` : `1=1`;
        const sql = `
      SELECT * FROM mock_responses
      WHERE ${whereSql}
      ORDER BY req_url, updated_at DESC
    `;
        console.log('[mock-responses] MockResponseService', sql);
        return this.db.prepare(sql).all();
    }
    findBy(by) {
        const whereSql = getWhereFromBy(by);
        const sql1 = `SELECT * FROM mock_responses WHERE ${whereSql} LIMIT 1`;
        return this.db.prepare(sql1).get();
    }
    findByIds(ids) {
        const whereSql = `id IN (${ids.join(',')})`;
        const sql1 = `SELECT * FROM mock_responses WHERE ${whereSql}`;
        return this.db.prepare(sql1).all();
    }
    update(data) {
        const reqMethod = data.req_method ? `'${data.req_method}'` : 'NULL';
        const reqName = data.name ? `'${data.name}'` : 'NULL';
        const resDelaySec = data.res_delay_sec ? data.res_delay_sec : 'NULL';
        const resBody = data.res_body.replace(/'/g, '\'\'');
        const sql = `
      UPDATE mock_responses SET
        name = ${reqName},
        active = ${data.active || 0},
        req_url = '${data.req_url}',
        req_method = ${reqMethod},
        req_payload = '${data.req_payload}',
        res_status = ${data.res_status},
        res_delay_sec = ${resDelaySec},
        res_content_type = '${data.res_content_type}',
        res_body =  '${resBody}',
        updated_at = ${new Date().getTime()},
        updated_by = '${username.sync()}'
      WHERE id = ${data.id};
      `;
        console.log('[mock-responses] MockResponseService', sql);
        if (this.db.exec(sql)) {
            better_sqlite3_1.BetterSqlite3.backupToSql();
        }
        else {
            throw '[mock-responses] error update mock_responses';
        }
    }
    activate(id) {
        const data = this.find(id);
        const deactivateSql = `UPDATE mock_responses SET active = 0 WHERE id <> ${id} AND req_url = '${data.req_url}'`;
        const activateSql = `UPDATE mock_responses SET active = 1 WHERE id = ${id}`;
        console.log('[mock-responses] MockResponseServivce', deactivateSql, activateSql);
        const result = this.db.exec(deactivateSql) && this.db.exec(activateSql);
        if (result) {
            better_sqlite3_1.BetterSqlite3.backupToSql();
        }
        else {
            throw '[mock-responses] error activate mock_responses';
        }
    }
    delete(id) {
        const sql = `DELETE FROM mock_responses where id=${id}`;
        console.log('[mock-responses] MockResponseService ', sql);
        if (this.db.exec(sql)) {
            better_sqlite3_1.BetterSqlite3.backupToSql();
        }
        else {
            throw '[mock-responses] error deleete mock_responses';
        }
    }
};
MockResponsesService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [])
], MockResponsesService);
exports.MockResponsesService = MockResponsesService;
//# sourceMappingURL=mock-responses.service.js.map