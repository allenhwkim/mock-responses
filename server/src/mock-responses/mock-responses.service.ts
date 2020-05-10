import * as username from 'username';
import { Injectable } from '@nestjs/common';
import { MockResponse } from '../common/interfaces/mock-response.interface';
import { BetterSqlite3 } from '../common/better-sqlite3';

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

  find(id: number) {
    const row = this.db.prepare(`SELECT * FROM mock_responses WHERE id = ${id}`);
    return row.get();
  }

  findAllBy(by:any ={}) {
    let sql;
    console.log('xxxxxxxxxxxxx', by)

    if (by.ids !== undefined) {
      sql = `
        SELECT * FROM mock_responses
        WHERE id IN (${by.ids})`;
    } else if (by.active !== undefined) {
      const useCase = this.db.prepare(`SELECT * FROM use_cases WHERE id = ${by.active}`).get();
      const ids = useCase.mock_responses.split(',').map(el => +el);
      sql = `
        SELECT * FROM mock_responses
        WHERE id IN (${ids}) 
        ORDER BY updated_at DESC, id`;
    } else {
      const where = getWhereFromBy(by) || '1 = 1';
      sql = `
        SELECT * FROM mock_responses 
        WHERE ${ where }
        ORDER BY req_url, updated_at DESC`;
    }
    
    console.log('[mock-responses] MockResponseService.findAllBy', sql);
    return this.db.prepare(sql).all();
  }

  create(data: MockResponse) {
    const createdAt = new Date().getTime();
    const reqMethod = data.req_method ? `'${data.req_method}'` : 'NULL';
    const reqName = data.name ? `'${data.name}'` : 'NULL';
    const resDelaySec = data.res_delay_sec ? data.res_delay_sec : 'NULL';
    const resBody = getJSON(data.res_body);
    const UUID = require('uuid-int');

    const sql = `
      INSERT INTO mock_responses(id, name,
        req_url, req_method, req_payload,
        res_status, res_delay_sec,
        res_content_type, res_body,
        created_at, created_by, updated_at, updated_by
        ) VALUES
        (
         ${UUID(0).uuid()}, ${reqName},
        '${data.req_url}', ${reqMethod}, '${data.req_payload}',
         ${data.res_status}, ${resDelaySec},
        '${data.res_content_type}', '${resBody}',
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
    const reqMethod = data.req_method ? `'${data.req_method}'` : 'NULL';
    const reqName = data.name ? `'${data.name}'` : 'NULL';
    const resDelaySec = data.res_delay_sec ? data.res_delay_sec : 'NULL';
    const resBody = data.res_body.replace(/'/g, '\'\'');

    const sql = `
      UPDATE mock_responses SET
        name = ${reqName},
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
      BetterSqlite3.backupToSql();
    } else {
      throw '[mock-responses] error update mock_responses'
    }
  }

  delete(id) {
    const sql = `DELETE FROM mock_responses where id=${id}`;
    console.log('[mock-responses] MockResponseService ', sql);
    if (this.db.exec(sql)) {
      BetterSqlite3.backupToSql();
    } else {
      throw '[mock-responses] error delete mock_responses'
    }
  }

}
