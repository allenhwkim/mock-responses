import * as username from 'username';
import { Injectable } from '@nestjs/common';

import { UseCase, MockResponse } from '../common/interfaces';
import { BetterSqlite3 } from '../common/better-sqlite3';
import { MockResponsesService } from '../mock-responses/mock-responses.service';

function getWhereFromBy(by) {
  const res = [];

  by.key && 
    res.push(`name like '%${by.key}%' OR description like '%${by.key}%' OR category like '%${by.key}%'`);
  by.category &&
    res.push(`category = '${by.category}'`);

  const where = res.length ? res.join(' AND ') : '1=1';
  return where;
}

@Injectable()
export class UseCasesService {
  db = BetterSqlite3.db;

  constructor(private mockResp: MockResponsesService) {}

  find(id: number) {
    const row = this.db.prepare(`SELECT * FROM use_cases WHERE id = ${id}`);
    return row.get();
  }

  findAllBy(by?) {
    const sqlByApiGroup = by && by.apiGroup && `
      SELECT category, COUNT(category) count
      FROM use_cases
      WHERE ${ getWhereFromBy(by) }
      GROUP BY category
      ORDER BY category`;
    const sqlByParameter = by && (by.key || by.category) && `
      SELECT *
      FROM use_cases
      WHERE ${ getWhereFromBy(by) }
      ORDER BY category`;
    const sqlByDefault = `
      SELECT * FROM use_cases 
      ORDER BY category;`;
    const sql = sqlByParameter || sqlByApiGroup || sqlByDefault;
    console.log('[mock-responses] UseCaseService.findAllBy', sql);

    return this.db.prepare(sql).all();
  }

  create(data: UseCase) {
    const name = data.name.trim().replace(/'/g, '\'\'');
    const description = data.description.trim().replace(/'/g, '\'\'');
    const category = data.category.trim().replace(/'/g, '\'\'');
    const mockResponses = data.mock_responses.trim().replace(/'/g, '\'\'');;

    const sql = `
      INSERT INTO use_cases 
        (name, description, category, mock_responses)
        VALUES ('${name}', '${description}', '${category}', '${mockResponses}');
      `;
    console.log('[mock-responses] UseCaseService use_cases create', sql);
    return this.db.exec(sql) && BetterSqlite3.backupToSql();
  }

  update(data: UseCase) {
    const name = data.name.trim().replace(/'/g, '\'\'');
    const description = data.description.trim().replace(/'/g, '\'\'');
    const category = data.category.trim().replace(/'/g, '\'\'');
    const mockResponses = data.mock_responses.trim().replace(/'/g, '\'\'');;

    const sql = `
      UPDATE use_cases SET
        name = '${name}',
        description = '${description}',
        category = '${category}',
        mock_responses = '${mockResponses}'
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
