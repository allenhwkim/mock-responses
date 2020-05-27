import { MockResponse } from './interfaces/mock-response.interface';
import { BetterSqlite3 } from './better-sqlite3';
import { CacheModule } from '@nestjs/common';

export const MockResponseCache = {
  data:  {REGEXP: {}},  // id -> mock_responses

  get: function (id) {
    const cached = MockResponseCache.data[id];
    if (!cached) {
      const mockResponse = BetterSqlite3.db.prepare(`SELECT * FROM mock_responses where id=${id}`).get();
      MockResponseCache.data[id] = mockResponse;
      return mockResponse;
    } else {
      return cached;
    }
  },

  set: function (mockResponse) {
    const {id, req_url, req_method} = mockResponse;

    // set db cache
    MockResponseCache.data[id] = mockResponse;

    // set regular expression index cache
    if (req_url.includes('*')) { // regular expression match
      const urlRegExp = req_url.replace(/\*/g, '(.*?)');
      MockResponseCache.data.REGEXP[urlRegExp] = req_url;
    }
  }
}
