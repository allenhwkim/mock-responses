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

  findAllBy(by?) {
    const sqlByApiGroup = by && by.key && `
      SELECT * FROM use_cases 
      WHERE name like '%${by.key}%' OR description like '%${by.key}%' OR category like '%${by.key}%'
      ORDER BY category ASC`;
    const sqlByDefault = `
      SELECT * FROM use_cases ORDER BY category ASC`;
    const sql = sqlByApiGroup || sqlByDefault;
    console.log('[mock-responses] UseCaseService.findAllBy', sql);

    return this.db.prepare(sql).all();
  }

  create(data: UseCase) {
    const name = data.name.trim().replace(/'/g, '\'\'');
    const description = data.description.trim().replace(/'/g, '\'\'');
    const mockResponses = data.mock_responses.trim().replace(/'/g, '\'\'');;
    const category = data.category.trim().replace(/'/g, '\'\'');

    const sql = `
      INSERT INTO use_cases 
        (name, description, mock_responses, category)
        VALUES ('${name}', '${description}', '${mockResponses}', '${category}');
      `;
    console.log('[mock-responses] UseCaseService use_cases create', sql);
    return this.db.exec(sql) && BetterSqlite3.backupToSql();
  }

  update(data: UseCase) {
    const name = data.name.trim().replace(/'/g, '\'\'');
    const description = data.description.trim().replace(/'/g, '\'\'');
    const mockResponses = data.mock_responses.trim().replace(/'/g, '\'\'');;
    const category = data.category.trim().replace(/'/g, '\'\'');

    const sql = `
      UPDATE use_cases SET
        name = '${name}',
        description = '${description}',
        mock_responses = '${mockResponses}',
        category = '${category}'
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

  activate(id) {
    const useCase = this.find(id);
    const ids = useCase.mock_responses.split(',').map(el => parseInt(el));
    console.log('[mock-responses] UseCaseService activate mock_responses with ids', ids);

    const mockResponses = this.mockResp.findAllBy({ids});
    mockResponses.forEach(mockResp => {
      this.mockResp.activate(mockResp.id);
    });
  }
}
