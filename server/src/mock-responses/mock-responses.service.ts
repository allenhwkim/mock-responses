import * as username from 'username';
import * as fetch from 'node-fetch';
import { Injectable } from '@nestjs/common';
import { MockResponse } from '../common/interfaces/mock-response.interface';
import { BetterSqlite3 } from '../common/better-sqlite3';
import { UseCaseToUseCasesService } from '../use-cases/use-case-to-use-cases.service';
import { UseCaseToMockResponsesService } from '../use-cases/use-case-to-mock-resonses.service';
import { UseCaseCache } from '../common/use-case-cache';
import { resolve } from 'dns';

function getJSON(data) {
  try {
    return JSON.stringify(JSON.parse(data));
  } catch (e) {
    // EMPTY
  }
  return data;
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
  ARCHIVE_JOB_STATUS = 'NOT_STARTED';
  LAST_ARCHIVED_TIME;

  constructor(
    private uc2uc: UseCaseToUseCasesService,
    private uc2mr: UseCaseToMockResponsesService
  ) {
    // start archive job
    setTimeout(_ => this.runInitialArchive());
  }

  find(id: number) {
    const row = this.db.prepare(`SELECT * FROM mock_responses WHERE id = ${id}`);
    return row.get();
  }

  lastArchived(userName) {
    const url = `/mock-responses/lastArchived/${userName}`;
    const row = this.db.prepare(`SELECT * FROM mock_responses WHERE req_url = '${url}'`);
    const existing = row.get();
    if (existing) {
      return existing.res_body;
    } else {
      const id = require('uuid-int')(0).uuid();
      const resBody = `{"lastArchived": ${new Date().getTime()}}`;
      const createdAt = new Date().getTime();
      const sql = `INSERT INTO mock_responses(
          id, name, req_url, res_content_type, res_body,
          created_at, created_by, updated_at, updated_by
        ) VALUES (
          ${id}, 'Last Archived', '${url}', 'application/json', '${resBody}',
          ${createdAt}, '${userName}', ${createdAt}, '${userName}'
        )`;
      try {
        this.db.exec(sql) && BetterSqlite3.backupToSql();
        return resBody;
      } catch (err) {
        console.log("[mock-responses] MockResponseService failed to insert query\n", err);
        return err;
      }
    }
  }

  archive(userName: string, mockResponse: MockResponse) {
    // 1) check if the same url/response exists
    const sql = `SELECT * FROM mock_responses
      WHERE req_url = '${mockResponse.req_url.trim()}' AND res_body = '${mockResponse.res_body.trim()}'`;
    const existing = this.db.prepare(sql).get();
    if (existing) {
      // 3) if not, insert a row, update LAST_ARCHIVED and return it
      console.log('\x1b[33m%s\x1b[0m', `[mock-responses] ARCHIVE skip, existing`, mockResponse.req_url);
    } else {
      delete mockResponse.id;
      this.create(mockResponse);
    }

    const resBody = `{"lastArchived": ${new Date().getTime()}}`;
    const sql2 = `UPDATE mock_responses SET
      res_body='${resBody}', updated_at=${new Date().getTime()}, updated_by='${userName}'
      WHERE req_url = '/mock-responses/last-archived/${userName}'`;
    return this.db.exec(sql) && resBody;
  }

  findAllBy(by:any ={}) {
    if (by.ids) {
      const sql = `
        SELECT * FROM mock_responses
        WHERE id IN (${by.ids})`;
      console.log('[mock-responses] MockResponseService.findAllBy', sql);
      return this.db.prepare(sql).all();
    } else if (by.useCases) {
      const useCaseIds =  by.useCases.split(',');
      // set cache to UseCaseCache[ucId] if not defined
      useCaseIds.forEach(ucId => !(UseCaseCache.data[+ucId]) && UseCaseCache.set(+ucId));

      return UseCaseCache.getByUseCaseIds(useCaseIds); // get data from cache
    } else {
      const where = getWhereFromBy(by) || '1 = 1';
      const columns = 'id, name, req_method, req_url, req_payload, ' + 
        'res_status, res_content_type, res_delay_sec, ' + // no res_body(too big)
        'created_at, created_by, updated_at, updated_by';
      const sql = `
        SELECT ${columns} FROM mock_responses 
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
    const resBody = getJSON(data.res_body).replace(/'/g, "''");
    const resContentType = data.res_content_type || 'application/json';
    const id = data.id || require('uuid-int')(0).uuid();
    const userName = data.username || username.sync();
    const sql = `
      INSERT INTO mock_responses(
          id, name,
          req_url, req_method, req_payload,
          res_status, res_delay_sec,
          res_content_type, res_body,
          created_at, created_by, updated_at, updated_by
        ) VALUES (
          ${id}, ${reqName},
          '${data.req_url}', ${reqMethod}, '${reqPayload}',
          ${resStatus}, ${resDelaySec},
          '${resContentType}', '${resBody}',
          ${createdAt}, '${userName}', ${createdAt}, '${userName}'
        )
      `;

    try {
      this.db.exec(sql) && BetterSqlite3.backupToSql();
      UseCaseCache.reset(); // clear cache and set defaults

      if (BetterSqlite3.archiveApi && BetterSqlite3.archiveApi.archiveUrl) {
        const payload = { userName: username.sync(), mockResponse: data };
        fetch(BetterSqlite3.archiveApi.archiveUrl, {
            method: 'POST', 
            headers: {
              'req-domain-name':  BetterSqlite3.archiveApi.localDomainName,
              'User-Agent': 'Chrome/59.0.3071.115',
              'Content-Type': 'application/json' 
            },
            body: JSON.stringify(payload)
          })
          .then(resp => {
            if (!resp.ok) { throw Error(resp)};
            console.log('\x1b[33m%s\x1b[0m', `[mock-responses] ARCHIVE success`, username, data.req_url);
            return resp.json();
          })
          .then(resp => console.log('[mock-responses] single archive', resp))
          .catch(function(error) {
            console.log('\x1b[33m%s\x1b[0m', `[mock-responses] ARCHIVE cancelled because server not available`);
            console.log('\x1b[33m%s\x1b[0m', `[mock-responses] ARCHIVE url, ${BetterSqlite3.archiveApi.archiveUrl}`);
          });
      }
    } catch (err) {
      console.log('\x1b[33m%s\x1b[0m', '[mock-responses] ARCHIVE insert error\n', err);
    }
  }

  update(data) {
    const columns = [];
    for (var key in data) {
      if (key === 'res_status' || key === 'res_delay_sec') { // boolean, number types
        columns.push(`${key} = ${data[key]}`);
      } else if (key !== 'id') { // string types
        columns.push(`${key} = '${data[key].replace(/'/g, "''")}'`);
      }
    }

    const sql = `
      UPDATE mock_responses SET
        ${columns.join(',\n')},
        updated_at = ${new Date().getTime()},
        updated_by = '${username.sync()}'
      WHERE id = ${data.id};
      `;

    if (this.db.exec(sql)) {
      UseCaseCache.reset(); // clear cache and set defaults
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

    UseCaseCache.reset(); // clear cache and set defaults
    BetterSqlite3.backupToSql();
  }

  runInitialArchive() {
    // 0) if config.archiveServer not exists, exit
    if (!BetterSqlite3.archiveApi) return;

    // 0) get LAST_ARCHIVED time stamp, if success set it, if 500, exit
    const userName = username.sync();
    const checkUrl = BetterSqlite3.archiveApi.statusCheckUrl.replace('{{username}}', userName);
    fetch(checkUrl, {
        method: 'GET',
        headers: {
          'req-domain-name':  BetterSqlite3.archiveApi.localDomainName, 
          'User-Agent': 'Chrome/59.0.3071.115',
          'Content-Type': 'application/json' 
        }
      }).then(function(resp) {
        if (!resp.ok) { throw Error(resp.statusText); }
        return resp.json();
      }).then(resp => {
        this.LAST_ARCHIVED_TIME = resp.lastArchived;
        // 1) set ARCHIVE_JOB_STATUS as STARTED
        this.ARCHIVE_JOB_STATUS = 'STARTED'; 
        // 2) get all mock-responses after LAST_ARCHIVED time
        const sql = `SELECT * FROM mock_responses WHERE updated_at > ${resp.lastArchived}`;
        console.log('\x1b[33m%s\x1b[0m', '[mock-responses] ARCHIVE 1 last archived', this.LAST_ARCHIVED_TIME);
        return this.db.prepare(sql).all();
      }).then(mockResps => {
        // 3) Search all mock responses to archive
        console.log('\x1b[33m%s\x1b[0m', '[mock-responses] ARCHIVE 2 processing', mockResps);
        let processed = 0;
        return new Promise(resolve => {
          mockResps.forEach(mockResponse => {
            const payload = { userName: username.sync(), mockResponse };
            fetch(BetterSqlite3.archiveApi.archiveUrl, {
                method: 'POST',
                headers: {
                  'req-domain-name':  BetterSqlite3.archiveApi.localDomainName,
                  'User-Agent': 'Chrome/59.0.3071.115',
                  'Content-Type': 'application/json' 
                },
                body: JSON.stringify(payload)
              }).then(resp => {
                if (!resp.ok) resp.text().then(err => console.log(err));
                if (!resp.ok) { throw Error(resp.statusText); }
                console.log('\x1b[33m%s\x1b[0m', '[mock-responses] ARCHIVE', mockResponse.req_url, resp.status);
                ((processed++) >= mockResps.length) && resolve(mockResps.length);
                return resp.json()
              }).catch(error => {
                console.log('\x1b[33m%s\x1b[0m', `[mock-responses] ARCHIVE error`, error);
                console.log('\x1b[33m%s\x1b[0m', `[mock-responses] ARCHIVE error`, mockResponse);
              });
          })
        })
      }).then(resp => {
        // 5) when finished, update ARCHIVE_JOB_STATUS as COMPLETED   
        this.LAST_ARCHIVED_TIME = new Date().getTime();
      }).catch(function(error) {
        console.log('\x1b[33m%s\x1b[0m', `[mock-responses] ARCHIVE server not available`, error);
        console.log('\x1b[33m%s\x1b[0m', `[mock-responses] archive url`, checkUrl);
      });
  }
}
