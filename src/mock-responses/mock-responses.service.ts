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
  by.active && res.push(`active = ${by.active}`);
  by.req_url && res.push(`req_url = '${by.req_url}'`);
  by.req_method && res.push(`req_method = '${by.req_method}'`);
  by.req_payload && res.push(`req_payload LIKE '%${by.req_payload}%'`);
  by.res_status && res.push(`req_status = ${by.res_status}`);
  by.res_delay_sec && res.push(`req_delay_sec = ${by.res_delay_sec}`);
  by.res_content_type && res.push(`req_content_type = ${by.res_content_type}`);

  const where = res.length ? res.join(' AND ') : '1=1';
  return where;
}

@Injectable()
export class MockResponsesService {
  db = BetterSqlite3.db;

  find(id: number) {
    const row = this.db.prepare(`SELECT * FROM mock_responses WHERE id = ${id}`);
    return row.get();
  }

  findAllBy(by?) {
    const sqlByApiGroup = by && by.apiGroup && `
      SELECT req_url, MAX(updated_at) updated_at, COUNT(req_url) count
      FROM mock_responses
      WHERE ${ getWhereFromBy(by) }
      GROUP BY req_url
      ORDER BY MAX(updated_at) DESC`;
    const sqlByIds = by && by.ids && `
      SELECT * FROM mock_responses WHERE id IN (${by.ids.join(',')}) ORDER BY id`;
    const sqlByAny = by && `
      SELECT * FROM mock_responses
      WHERE ${ getWhereFromBy(by) }
      ORDER BY active DESC, updated_at DESC`;
    const sqlByDefault = `
      SELECT * FROM mock_responses 
      ORDER BY req_url, updated_at DESC`;

    const sql = sqlByApiGroup || sqlByIds || sqlByAny || sqlByDefault;
    console.log('[mock-responses] MockResponseService.findAllBy', sql);
    return this.db.prepare(sql).all();
  }

  create(data: MockResponse) {
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
      BetterSqlite3.backupToSql();
    } else {
      throw '[mock-responses] error update mock_responses'
    }
  }

  activate(id) {
    const data = this.find(id);
    const deactivateSql = `UPDATE mock_responses SET active = 0 WHERE id <> ${id} AND req_url = '${data.req_url}'`;
    const activateSql = `UPDATE mock_responses SET active = 1 WHERE id = ${id}`;

    console.log('[mock-responses] MockResponseService', deactivateSql, activateSql);
    const result = this.db.exec(deactivateSql) && this.db.exec(activateSql);

    if (result) {
      BetterSqlite3.backupToSql();
    } else {
      throw '[mock-responses] error activate mock_responses'
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
