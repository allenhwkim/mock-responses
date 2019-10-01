import * as username from 'username';
import { Injectable } from '@nestjs/common';

import { UseCase, MockResponse } from '../common/interfaces';
import { BetterSqlite3 } from '../common/better-sqlite3';
import { MockResponsesService } from '../mock-responses/mock-responses.service';

@Injectable()
export class UseCasesService {
  db;

  constructor(private mockResp: MockResponsesService) {
    this.db =  BetterSqlite3.db;
  }

  create(data: UseCase) {
    const name = data.name.trim().replace(/'/g, '\'\'');
    const description = data.description.trim().replace(/'/g, '\'\'');
    const mockResponses = data.mock_responses.trim().replace(/'/g, '\'\'');;

    const sql = `
      INSERT INTO use_cases 
        (name, description, mock_responses)
        VALUES ('${name}', '${description}', '${mockResponses}');
      `;
    console.log('[mock-responses] use_cases create', sql);
    if (this.db.exec(sql)) {
      BetterSqlite3.backupToSql();
    } else {
      throw '[mock-responses] error create use_cases'
    }
  }

  find(id: number) {
    const row = this.db.prepare(`SELECT * FROM use_cases WHERE id = ${id}`);
    return row.get();
  }

  findAll(key?) {
    const whereSql = key ?
      `name like '%${key}%' OR description like '%${key}%'` : `1=1`;

    const sql = `SELECT * FROM use_cases WHERE ${whereSql}`;
    console.log('[mock-responses]', sql);
    return this.db.prepare(sql).all();
  }

  update(data: UseCase) {
    const name = data.name.trim().replace(/'/g, '\'\'');
    const description = data.description.trim().replace(/'/g, '\'\'');
    const mockResponses = data.mock_responses.trim().replace(/'/g, '\'\'');;

    const sql = `
      UPDATE use_cases SET
        name = '${name}',
        description = '${description}',
        mock_responses = '${mockResponses}'
      WHERE id = ${data.id};
      `;
    console.log('[mock-responses]', sql);
    const result = this.db.exec(sql);
    if (this.db.exec(sql)) {
      BetterSqlite3.backupToSql();
    } else {
      throw '[mock-responses] error update use_cases'
    }
  }

  delete(id) {
    const sql = `DELETE FROM use_cases where id=${id}`;

    console.log('[mock-responses]', sql);
    const result = this.db.exec(sql);
    if (this.db.exec(sql)) {
      BetterSqlite3.backupToSql();
    } else {
      throw '[mock-responses] error delete use_cases'
    }
  }

  activate(id) {
    const useCase = this.find(id);
    const mockRespIds = useCase.mock_responses.split(',').map(el => parseInt(el));
    console.log('[mock-responses] activate mock_responses with ids', mockRespIds);

    const mockResponses = this.mockResp.findByIds(mockRespIds);
    mockResponses.forEach(mockResp => {
      this.mockResp.activate(mockResp.id);
    });
  }
}
