import * as username from 'username';
import { Injectable } from '@nestjs/common';

import { UseCase, MockResponse } from '../common/interfaces';
import { BetterSqlite3 } from '../common/better-sqlite3';
import { MockResponsesService } from '../mock-responses/mock-responses.service';

@Injectable()
export class UseCasesService {
  db = BetterSqlite3.db;

  constructor(private mockResp: MockResponsesService) {}

  find(id: number) {
    const row = this.db.prepare(`SELECT * FROM use_cases WHERE id = ${id}`);
    return row.get();
  }

  findAllBy(by) {
    const sql = 
      by.key !== undefined ? 
        `SELECT * FROM use_cases WHERE name LIKE '%${by.key}%' OR description like '%${by.key}%'`: 
      by.ids !== undefined ? 
        `SELECT * FROM use_cases WHERE id IN (${by.ids})`:
      by.except !== undefined ? 
        `SELECT * FROM use_cases WHERE id NOT IN (${by.except})`:
        `SELECT * FROM use_cases`;
    console.log('[mock-responses] UseCaseService.findAllBy', sql);

    return this.db.prepare(sql).all();
  }

  create(data: UseCase) {
    const name = data.name.trim().replace(/'/g, '\'\'');
    const description = data.description.trim().replace(/'/g, '\'\'');
    const mockResponses = data.mock_responses.trim().replace(/'/g, '\'\'');;
    const UUID = require('uuid-int');

    const sql = `
      INSERT INTO use_cases 
        (id, name, description, mock_responses)
        VALUES (${UUID(0).uuid()}, '${name}', '${description}', '${mockResponses}');
      `;
    console.log('[mock-responses] UseCaseService use_cases create', sql);
    return this.db.exec(sql) && BetterSqlite3.backupToSql();
  }

  update(data: UseCase) {
    const name = data.name.trim().replace(/'/g, '\'\'');
    const description = data.description.trim().replace(/'/g, '\'\'');
    const mockResponses = data.mock_responses.trim().replace(/'/g, '\'\'');;
    const useCases = data.use_cases.trim().replace(/'/g, '\'\'');;

    const sql = `
      UPDATE use_cases SET
        name = '${name}',
        description = '${description}',
        mock_responses = '${mockResponses}',
        use_cases ='${useCases}'
      WHERE id = ${data.id};
      `;
    console.log('[mock-responses] UseCaseService', sql);
    const result = this.db.exec(sql);
    return this.db.exec(sql) && BetterSqlite3.backupToSql();
  }

  delete(id) {
    const sql = `DELETE FROM use_cases where id=${id}`;

    console.log('[mock-responses] UseCaseService', sql);
    const result = this.db.exec(sql);
    return this.db.exec(sql) && BetterSqlite3.backupToSql();
  }


  cookies(req, key) {
    const cookies = {};
    (req.headers.cookie || '').split('; ').forEach(el => {
      const [k,v] = el.split('=');
      cookies[k] = v;
    });
    return key ? cookies[key] : cookies;
  }
}
