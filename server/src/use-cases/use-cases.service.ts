import * as username from 'username';
import { Injectable } from '@nestjs/common';

import { UseCase, MockResponse } from '../common/interfaces';
import { BetterSqlite3 } from '../common/better-sqlite3';
import { MockResponsesService } from '../mock-responses/mock-responses.service';
import { UseCaseToUseCasesService } from './use-case-to-use-cases.service';
import { UseCaseToMockResponsesService } from './use-case-to-mock-resonses.service';

@Injectable()
export class UseCasesService {
  db = BetterSqlite3.db;

  constructor(
    private mockResp: MockResponsesService,
    private uc2ucs: UseCaseToUseCasesService,
    private uc2mrs: UseCaseToMockResponsesService
  ) {}

  find(id: number) {
    const row = this.db.prepare(`SELECT * FROM use_cases WHERE id = ${id}`);
    const useCase = row.get();
    useCase.useCases = this.uc2ucs.findAll(id);
    useCase.mockResponses = this.uc2mrs.findAll(id);
    return useCase;
  }

  findAllBy(by) {
    const sql = 
      by.key ? 
        `SELECT * FROM use_cases WHERE name LIKE '%${by.key}%' OR description like '%${by.key}%'`: 
      by.ids ? 
        `SELECT * FROM use_cases WHERE id IN (${by.ids})`:
      by.except ? 
        `SELECT * FROM use_cases WHERE id NOT IN (${by.except})`:
        `SELECT * FROM use_cases`;
    console.log('[mock-responses] UseCaseService.findAllBy', sql);

    const useCases = this.db.prepare(sql).all();
    useCases.forEach(useCase => {
      useCase.useCases = this.uc2ucs.findAll(useCase.id);
      useCase.mockResponses = this.uc2mrs.findAll(useCase.id);
    });

    return useCases;
  }

  create(data: UseCase) {
    const name = data.name.trim().replace(/'/g, '\'\'');
    const description = data.description.trim().replace(/'/g, '\'\'');
    const UUID = require('uuid-int');
    const useCaseId = UUID(0).uuid();

    const sql = `
      INSERT INTO use_cases 
        (id, name, description, mock_responses)
        VALUES (${useCaseId}, '${name}', '${description}');
      `;
    console.log('[mock-responses] UseCaseService use_cases create', sql);
    this.db.exec(sql);

    this.uc2ucs.updateAllChildren(useCaseId, data.useCaseIds);
    this.uc2mrs.updateAllChildren(useCaseId, data.mockResponseIds);

    return BetterSqlite3.backupToSql();
  }

  update(data: UseCase) {
    const columns = [];
    data.name && 
      columns.push(`name = '${data.name.trim().replace(/'/g, '\'\'')}'`);
    data.description &&
      columns.push(`description = '${data.description.trim().replace(/'/g, '\'\'')}'`);

    const sql = `
      UPDATE use_cases SET
        ${columns.join(',\n')}
      WHERE id = ${data.id};
      `;
    console.log('[mock-responses] UseCaseService', sql);
    this.db.exec(sql);

    this.uc2ucs.updateAllChildren(data.id, data.useCaseIds);
    this.uc2mrs.updateAllChildren(data.id, data.mockResponseIds);

    return BetterSqlite3.backupToSql();
  }

  delete(id) {
    const sql = `DELETE FROM use_cases where id=${id}`;
    console.log('[mock-responses] UseCaseService', sql);
    this.db.exec(sql);

    const sql2 = `DELETE FROM use_case_to_use_cases where use_case_id=${id}`;
    console.log('[mock-responses] UseCaseService', sql2);
    this.db.exec(sql2);

    const sql3 = `DELETE FROM use_case_to_use_cases where child_use_case_id=${id}`;
    console.log('[mock-responses] UseCaseService', sql3);
    this.db.exec(sql3);

    return BetterSqlite3.backupToSql();
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
