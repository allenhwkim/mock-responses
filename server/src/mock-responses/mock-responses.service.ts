import * as username from 'username';
import { Injectable } from '@nestjs/common';
import { MockResponse } from '../common/interfaces/mock-response.interface';
import { BetterSqlite3 } from '../common/better-sqlite3';
import { UseCaseToUseCasesService } from 'src/use-cases/use-case-to-use-cases.service';
import { UseCaseToMockResponsesService } from 'src/use-cases/use-case-to-mock-resonses.service';

function getJSON(data) {
  try {
    return JSON.stringify(JSON.parse(data)).replace(/'/g, '\'\'');
  } catch (e) {
    // EMPTY
  }
  return data.replace(/'/g, '\'\'');
}

function getWhereFromBy(by) {
  const res = [];
  by.key && 
    res.push(`name like '%${by.key}%' OR req_url like '%${by.key}%' OR res_body like '%${by.key}%'`);
  by.req_url && res.push(`req_url = '${by.req_url}'`);
  by.req_method && res.push(`req_method = '${by.req_method}'`);
  by.req_payload && res.push(`req_payload LIKE '%${by.req_payload}%'`);
  by.res_status && res.push(`req_status = ${by.res_status}`);
  by.res_delay_sec && res.push(`req_delay_sec = ${by.res_delay_sec}`);
  by.res_content_type && res.push(`req_content_type = ${by.res_content_type}`);

  const where = res.length ? res.join(' AND ') : undefined;
  return where;
}

@Injectable()
export class MockResponsesService {
  db = BetterSqlite3.db;
  useCasesCached = {}; // use_case.id -> url -> method -> mock_response.id
  mockResponsesCached = {}; // mock_response.id -> MockResponse

  constructor(
    private uc2uc: UseCaseToUseCasesService,
    private uc2mr: UseCaseToMockResponsesService
  ) {}

  find(id: number) {
    const row = this.db.prepare(`SELECT * FROM mock_responses WHERE id = ${id}`);
    return row.get();
  }

  findAllBy(by:any ={}) {
    if (by.ids) {
      const sql = `
        SELECT * FROM mock_responses
        WHERE id IN (${by.ids})`;
      console.log('[mock-responses] MockResponseService.findAllBy', sql);
      return this.db.prepare(sql).all();
    } else if (by.useCases) {
      return this.findAllByUseCases(by.useCases);
    } else {
      const where = getWhereFromBy(by) || '1 = 1';
      const sql = `
        SELECT * FROM mock_responses 
        WHERE ${ where }
        ORDER BY updated_at DESC`;
      console.log('[mock-responses] MockResponseService.findAllBy', sql);
      return this.db.prepare(sql).all();
    }
  }

  create(data: MockResponse) {
    const createdAt = new Date().getTime();
    const reqMethod = data.req_method ? `'${data.req_method}'` : 'NULL';
    const reqName = data.name ? `'${data.name}'` : 'NULL';
    const reqPayload = data.req_payload || '';
    const resDelaySec = data.res_delay_sec ? data.res_delay_sec : 0;
    const resStatus = data.res_status || 200;
    const resBody = getJSON(data.res_body);
    const resContentType = data.res_content_type || 'application/json';
    const UUID = require('uuid-int');
    const sql = `
      INSERT INTO mock_responses(
          id, name,
          req_url, req_method, req_payload,
          res_status, res_delay_sec,
          res_content_type, res_body,
          created_at, created_by, updated_at, updated_by
        ) VALUES (
          ${UUID(0).uuid()}, ${reqName},
          '${data.req_url}', ${reqMethod}, '${reqPayload}',
          ${resStatus}, ${resDelaySec},
          '${resContentType}', '${resBody}',
          ${createdAt}, '${username.sync()}', ${createdAt}, '${username.sync()}'
        )
      `;

    console.log('[mock-responses] MockResponseService create', sql);
    try {
      this.db.exec(sql) && BetterSqlite3.backupToSql();
    } catch (err) {
      console.log("[mock-responses] MockResponseService failed to insert query\n", err);
    }
    
  }

  update(data) {
    const columns = [];
    data.req_url && columns.push(`req_url = '${data.req_url}'`);
    data.req_name && columns.push(`req_name = '${data.req_name}'`);
    data.req_method && columns.push(`req_method = '${data.req_method}'`);
    data.req_payload && columns.push(`req_payload = '${data.req_palyload}'`);
    data.res_status && columns.push(`res_status = ${data.res_status}`);
    data.res_delay_sec && columns.push(`res_delay_sec = ${data.res_delay_sec}`);
    data.res_content_type && columns.push(`res_content_type = '${data.res_content_type}'`);
    data.res_body && columns.push(`res_body = '${data.res_body.replace(/'/g, '\'\'')}'`);

    const sql = `
      UPDATE mock_responses SET
        ${columns.join(',\n')},
        updated_at = ${new Date().getTime()},
        updated_by = '${username.sync()}'
      WHERE id = ${data.id};
      `;

    if (this.db.exec(sql)) {
      BetterSqlite3.backupToSql();
    } else {
      throw '[mock-responses] error update mock_responses'
    }
  }

  delete(id) {
    const sql = `DELETE FROM mock_responses where id=${id}`;
    console.log('[mock-responses] MockResponseService ', sql);
    this.db.exec(sql);

    const sql2 = `DELETE FROM use_case_to_mock_responses where mock_response_id=${id}`;
    console.log('[mock-responses] MockResponseService ', sql2);
    this.db.exec(sql2);

    BetterSqlite3.backupToSql();
  }

  findAllByUseCases(useCaseIds) {
    if (typeof useCaseIds === 'string') {
      useCaseIds = useCaseIds.split(',').map(el => +el);
    }
    let urls = {};
    useCaseIds.forEach(ucId => {
      urls = {...urls, ...this.findAllByUseCase(ucId)};
    });
    return urls;
  }

  findAllByUseCase(useCaseId, processedOnes=[]) {
    if (this.useCasesCached[useCaseId]) {
      console.log('cache is already set for use case', useCaseId);
    } else {
      const useCaseIds = this.uc2uc.findAll(useCaseId);

      const mockRespIds = this.uc2mr.findAll(useCaseId)
        .map(el => el.mock_response_id).join(',') || '0';
      const mockResponses = this.findAllBy({ids: mockRespIds});
      mockResponses.forEach((mockResp: MockResponse) => {
        this.useCasesCached[useCaseId] = this.useCasesCached[useCaseId] || {};
        this.setUseCase(this.useCasesCached[useCaseId], mockResp);
      });
      processedOnes.push(useCaseId);

      useCaseIds.forEach(useCase => {
        if (processedOnes.indexOf(useCase.id) !== -1) {
          console.log('[mock-responses] alreday process use_case id', useCase.id);
          return false;
        } else {
          this.findAllByUseCase(useCase.id, processedOnes); // process child use case
        }
      })
    }
    return this.useCasesCached[useCaseId];
  }

  setUseCase(useCase, mockResp) {
    this.mockResponsesCached[mockResp.id] = mockResp;
    const [url, method] = [mockResp.req_url, mockResp.req_method]; 
    useCase[url] = useCase[url] || {};
    useCase[url][method || '*'] = this.mockResponsesCached[mockResp.id];

    if (url.includes('*')) { // regular expression match
      useCase['REGEXP'] = useCase['REGEXP'] || {};
      const urlRegExp = url.replace(/\*/g, '(.*?)');
      useCase['REGEXP'][urlRegExp] = url;
    }
  }

}
