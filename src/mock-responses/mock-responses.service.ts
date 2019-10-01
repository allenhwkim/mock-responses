import * as username from 'username';
import { Injectable } from '@nestjs/common';
import { MockResponse } from '../common/interfaces/mock-response.interface';
import { BetterSqlite3 } from '../common/better-sqlite3';

function getJSON(data) {
  try {
    return JSON.stringify(JSON.parse(data.res_doby), null, '  ');
  } catch (e) {
    // EMPTY
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

@Injectable()
export class MockResponsesService {
  db;

  constructor() {
    this.db =  BetterSqlite3.db;
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
         ${reqName}, ${data.active},
        '${data.req_url}', ${reqMethod}, '${data.req_payload}',
         ${data.res_status}, ${resDelaySec},
        '${data.res_content_type}', '${resBody}',
         ${createdAt}, '${username.sync()}', ${createdAt}, '${username.sync()}'
        )
      `;

    console.log('[mock-responses] create', sql);
    const result = this.db.exec(sql);
    result && BetterSqlite3.backupToSql();
    return result;
  }

  find(id: number) {
    const row = this.db.prepare(`SELECT * FROM mock_responses WHERE id = ${id}`);
    return row.get();
  }

  findAll(key?) {
    const whereSql = key ?
      `name like '%${key}%' OR req_url like '%${key}%' OR res_body like '%${key}%'` : `1=1`;
    const sql = `
      SELECT * FROM mock_responses
      WHERE ${whereSql}
      ORDER BY req_url, updated_at DESC
    `;

    console.log('[mock-responses]', sql);
    return this.db.prepare(sql).all();
  }

  findBy(by: any) {
    const whereSql = getWhereFromBy(by);
    const sql1 = `SELECT * FROM mock_responses WHERE ${whereSql} LIMIT 1`;
    return this.db.prepare(sql1).get();
  }

  findByIds(ids: Array<number>) {
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
        active = ${data.active},
        req_url = '${data.req_url}',
        req_method = ${reqMethod},
        req_payload = '${data.req_payload}',
        res_status = ${data.res_status},
        res_delay_sec = ${resDelaySec},
        res_content_type = '${data.res_content_type}',
        res_body =  '${resBody}',
        updated_at = ${new Date().getTime()},
        updated_by = '${username}'
      WHERE id = ${data.id};
      `;
    console.log('[mock-responses]', sql);

    const result = this.db.exec(sql);
    result && BetterSqlite3.backupToSql();
    return result;
  }

  activate(id): string {
    const data = this.find(id);
    const deactivateSql = `UPDATE mock_responses SET active = 0 WHERE id <> ${id} AND req_url = '${data.req_url}'`;
    const activateSql = `UPDATE mock_responses SET active = 1 WHERE id = ${id}`;

    console.log('[mock-responses]', deactivateSql, activateSql);
    const result = this.db.exec(deactivateSql) && this.db.exec(activateSql);
    result && BetterSqlite3.backupToSql();
    return result;
  }

  delete(id) {
    const sql = `DELETE FROM mock_responses where id=${id}`;
    console.log('[mock-responses]', sql);
    const result = this.db.exec(sql);
    result && BetterSqlite3.backupToSql();
    return result;
  }

}
