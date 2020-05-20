import * as username from 'username';
import { MockResponse } from '../common/interfaces/mock-response.interface';
import { BetterSqlite3 } from '../common/better-sqlite3';
import { UseCaseToUseCasesService } from 'src/use-cases/use-case-to-use-cases.service';
import { UseCaseToMockResponsesService } from 'src/use-cases/use-case-to-mock-resonses.service';
import { UseCasesService } from 'src/use-cases/use-cases.service';

export const UseCaseCache = {
  data:  {REGEXP: {}, 0: {}},  // use_case.id -> url -> method -> mock_response.id
  mockResponses: {}, // id -> mock_response

  getAvailableMockResponses: function(req, omitted=false) {
    const ucIds = UseCaseCache.getCookie(req, 'UCIDS') || '0';
    const sql1 = `SELECT * FROM use_cases WHERE id IN (${ucIds})`;
    console.log('[mock-responses] UseCaseCache', sql1);
    const activeUseCases = BetterSqlite3.db.prepare(sql1).all();

    const mrIds = UseCaseCache.getCookie(req, 'MRIDS') || '0';
    const sql2 = ` SELECT * FROM mock_responses WHERE id IN (${mrIds})`;
    console.log('[mock-responses] UseCaseCache', sql2);
    const activeMockResponses = BetterSqlite3.db.prepare(sql2).all();

    // get from cache
    const useCaseIds = [0, ...ucIds.split(',')]; // 0 .. default
    const availableMockResponses = Object.assign({}, UseCaseCache.getByUseCaseIds(useCaseIds));
    activeMockResponses.forEach(mockResp => {
      UseCaseCache.setMockResponse(availableMockResponses, mockResp);
    });

    if (omitted) {
      for (var url in availableMockResponses) {
        for (var method in availableMockResponses[url]) {
          delete availableMockResponses[url][method].res_body;
        }
      }
    }

    return { activeUseCases, activeMockResponses, availableMockResponses}
  },

  getByUseCaseIds: function (useCaseIds: Array<any>) { 
    let urls = {};
    useCaseIds.forEach(ucId => {
      ucId = +ucId;
      const cached = UseCaseCache.data[ucId] || UseCaseCache.set(ucId);
      urls = {...urls, ...cached};
    });
    return urls;
  },

  set: function (useCaseId, processedOnes=[]) {
    if (UseCaseCache.data[useCaseId]) {
      console.log('cache is already set for use case', useCaseId);
    } else {
      const mockRespIds = UseCaseCache.findMockResponseIdsByUseCaseId(useCaseId)
        .map(el => el.mock_response_id).join(',') || '0';
      const mockResponses = UseCaseCache.findMockResponsesByIds(mockRespIds);
      mockResponses.forEach((mockResp: MockResponse) => {
        UseCaseCache.data[useCaseId] = UseCaseCache.data[useCaseId] || {};
        UseCaseCache.setMockResponse(UseCaseCache.data[useCaseId], mockResp)
      });
      processedOnes.push(useCaseId);

      const useCases = UseCaseCache.findUseCaseIdsByUseCaseId(useCaseId);
      useCases.forEach(useCase => {
        if (processedOnes.indexOf(useCase.id) !== -1) {
          console.log('[mock-responses] alreday process use_case id', useCase.id);
          return false;
        } else {
          UseCaseCache.set(useCase.id, processedOnes); // process child use case
        }
      })
    }

    return UseCaseCache.data[useCaseId];
  },

  setMockResponse: function (availMockResponses, mockResp) {
    UseCaseCache.mockResponses[mockResp.id] = mockResp;

    const [url, method] = [mockResp.req_url, mockResp.req_method]; 
    availMockResponses[url] = availMockResponses[url] || {};
    availMockResponses[url][method || '*'] = UseCaseCache.mockResponses[mockResp.id];

    if (url.includes('*')) { // regular expression match
      UseCaseCache.data.REGEXP = UseCaseCache.data.REGEXP || {};
      const urlRegExp = url.replace(/\*/g, '(.*?)');
      UseCaseCache.data.REGEXP[urlRegExp] = url;
    }
    
    return availMockResponses;
  },

  setDefault: function() {
    const sql = `SELECT * FROM mock_responses 
      GROUP BY req_url, req_method ORDER BY req_url, req_method, created_at`;
    console.log('[mock-responses] UseCaseCache', sql);
    const mockResponses = BetterSqlite3.db.prepare(sql).all();

    mockResponses.forEach(mockResp => {
      UseCaseCache.mockResponses[mockResp.id] = mockResp; 
      UseCaseCache.setMockResponse(UseCaseCache.data[0], mockResp);
    });
    return UseCaseCache.data[0];
  },

  getCookie: function (req, key): string {
    const cookies = {};
    (req.headers.cookie || '').split('; ').forEach(el => {
      const [k,v] = el.split('=');
      cookies[k] = v;
    });
    return cookies[key] ? decodeURIComponent(cookies[key]) : undefined;
  },

  findUseCaseIdsByUseCaseId: function(useCaseId) {
    const sql = 
      `SELECT * FROM use_case_to_use_cases WHERE use_case_id = ${useCaseId} ORDER BY sequence`; 
    console.log('[mock-responses] UseCaseToUseCasesService findAll', sql);
    return BetterSqlite3.db.prepare(sql).all();
  },

  findMockResponseIdsByUseCaseId: function(useCaseId) {
    const sql = 
      `SELECT * FROM use_case_to_mock_responses WHERE use_case_id = ${useCaseId} ORDER BY sequence`; 
    console.log('[mock-responses] UseCaseToMockResponsesService findAll', sql);
    return BetterSqlite3.db.prepare(sql).all();
  },

  findMockResponsesByIds: function (ids) {
    const sql = `SELECT * FROM mock_responses WHERE id IN (${ids})`;
    console.log('[mock-responses] MockResponseService.findAllBy', sql);
    return BetterSqlite3.db.prepare(sql).all();
  },

}
