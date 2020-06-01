import { MockResponse } from '../common/interfaces/mock-response.interface';
import { BetterSqlite3 } from '../common/better-sqlite3';
import { MockResponseCache } from './mock-response-cache';
import { CookieService } from './cookie-service';

export class UseCaseCache  {
  static data = {REGEXP: {}, 0: {}};  // use_case.id -> url -> method -> mock_response.id
  static mockResponses = {}; // id -> mock_response

  // complete one useCaseId with urls, methods and ids
  // set UseCaseCache.data[usecaseId] -> GET, POST, PUT.., by respecting child use cases
  static set(useCaseId, processedOnes=[]) {
    if (UseCaseCache.data[useCaseId]) {
      console.log('cache is already set for use case', useCaseId);
    } else {
      UseCaseCache.data[useCaseId] = UseCaseCache.data[useCaseId] || {};

      const mockRespIds = UseCaseCache.findMockResponseIdsByUseCaseId(useCaseId)
        .map(el => el.mock_response_id).join(',') || '0';

      const useCaseCached = UseCaseCache.data[useCaseId];
      const mockResponses = UseCaseCache.findMockResponsesByIds(mockRespIds);
      mockResponses.forEach((mockResp: MockResponse) => {
        MockResponseCache.set(mockResp);
        const {id, req_url, req_method} = mockResp;
        useCaseCached[req_url] = useCaseCached[req_url] || {};
        useCaseCached[req_url][req_method || '*'] = id; 
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
  }

  // reset all cached data with default data
  static reset() {
    UseCaseCache.data = {REGEXP: {}, 0: {}};
    MockResponseCache.data = {REGEXP: {}};

    UseCaseCache.setDefault();
  }

  // set default mock-responses, UseCacahe.data[0], as default with the first mock responses
  static setDefault() {
    const sql = `SELECT * FROM mock_responses 
      GROUP BY req_url, req_method ORDER BY req_url, req_method, created_at`;
    console.log('[mock-responses] UseCaseCache', sql);
    const mockResponses = BetterSqlite3.db.prepare(sql).all();
    const defaultUseCase = UseCaseCache.data[0];

    mockResponses.forEach(mockResp => {
      MockResponseCache.set(mockResp);
      const {id, req_url, req_method} = mockResp;
      defaultUseCase[req_url] = defaultUseCase[req_url] || {};
      defaultUseCase[req_url][req_method || '*'] = id;
    });
    return UseCaseCache.data[0];
  }

  // return mock response ids to actual mock response from cached data
  static replaceMockResponseIdToMockResponse(useCase) {
    for (var url in useCase) {
      for (var method in useCase[url]) {
        const mockRespId = useCase[url][method];
        const mockResp = MockResponseCache.get(mockRespId);
        useCase[url][method] =  {...mockResp};
        delete useCase[url][method].res_body;
      }
    }
  }

  // get available mock-responses from request cookies; UCIDS, MRIDS
  // if MRIDS is given, it deep-clones the cached cache data and return it, so that it does not touch data.
  // When try to get mock-responses from cache and cache is not set, it also set cache data
  static getAvailableMockResponses(req) {
    const ucIds = CookieService.getCookie(req, 'UCIDS') || '0';
    const sql1 = `SELECT * FROM use_cases WHERE id IN (${ucIds})`;
    console.log('[mock-responses] UseCaseCache', sql1);
    const activeUseCases = BetterSqlite3.db.prepare(sql1).all();

    const mrIds = CookieService.getCookie(req, 'MRIDS') || '0';
    const sql2 = ` SELECT * FROM mock_responses WHERE id IN (${mrIds})`;
    console.log('[mock-responses] UseCaseCache', sql2);
    const activeMockResponses = BetterSqlite3.db.prepare(sql2).all();

    const useCaseIds = [0, ...ucIds.split(',')]; // 0 .. default

    // set UseCaseCache[ucId] if not defined
    useCaseIds.forEach(ucId => !(UseCaseCache.data[ucId]) && UseCaseCache.set(+ucId)); 

    const cached = UseCaseCache.getByUseCaseIds(useCaseIds); // get data from cache
    const deepCloned = JSON.parse(JSON.stringify(cached));   // to keep cache data not touched
    if (activeMockResponses.length) {
      activeMockResponses.forEach(mockResp => {
        // this does not update cache, because deepCloned is a separate object
        MockResponseCache.set(mockResp);
        const {id, req_url, req_method} = mockResp;
        deepCloned[req_url] = deepCloned[req_url] || {};
        deepCloned[req_url][req_method || '*'] = id;
      });
    }

    return { 
      activeUseCases,
      activeMockResponses,
      availableMockResponses: deepCloned,
      mockResponseIds: UseCaseCache.getMockResponseIds(deepCloned)
    }
  }

  // return mock response ids from a use case
  static getMockResponseIds(useCase) { // useCase url -> method -> id
    const mockResponseIds = [];
    for (var url in useCase) {
      for (var method in useCase[url]) {
        mockResponseIds.push(useCase[url][method].id || useCase[url][method]);
      }
    }
    return mockResponseIds;
  }

  // return url/method/ids from multiple use case ids
  // get UseCaseCache.data[usecaseId] -> GET, POST, PUT.. from multiple usecase ids.
  // the response is merged data by last one prioritized
  static getByUseCaseIds (useCaseIds: Array<any>) { 
    let urls = {};
    useCaseIds.forEach(ucId => {
      const cached = UseCaseCache.data[+ucId];
      urls = {...urls, ...cached};
    });
    return urls;
  }

  // return use cases ids from a use case
  static findUseCaseIdsByUseCaseId(useCaseId) {
    const sql = 
      `SELECT * FROM use_case_to_use_cases WHERE use_case_id = ${useCaseId} ORDER BY sequence`; 
    console.log('[mock-responses] UseCaseToUseCasesService findAll', sql);
    return BetterSqlite3.db.prepare(sql).all();
  }

  // return mock response ids from a use case
  static findMockResponseIdsByUseCaseId(useCaseId) {
    const sql = 
      `SELECT * FROM use_case_to_mock_responses WHERE use_case_id = ${useCaseId} ORDER BY sequence`; 
    console.log('[mock-responses] UseCaseToMockResponsesService findAll', sql);
    return BetterSqlite3.db.prepare(sql).all();
  }

  // return mock responses from mock response ids
  static findMockResponsesByIds (ids) {
    const sql = `SELECT * FROM mock_responses WHERE id IN (${ids})`;
    console.log('[mock-responses] MockResponseService.findAllBy', sql);
    return BetterSqlite3.db.prepare(sql).all();
  }

}
