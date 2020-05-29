import * as username from 'username';
import { Injectable } from '@nestjs/common';

import { UseCase, MockResponse } from '../common/interfaces';
import { BetterSqlite3 } from '../common/better-sqlite3';
import { MockResponsesService } from '../mock-responses/mock-responses.service';
import { UseCaseToUseCasesService } from './use-case-to-use-cases.service';
import { UseCaseToMockResponsesService } from './use-case-to-mock-resonses.service';
import { UseCaseCache } from '../common/use-case-cache';

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

    const useCaseIds = this.uc2ucs.findAll(useCase.id)
      .sort((a, b) => +(a.sequence > b.sequence))
      .map(el => el.child_use_case_id).join(',');
    useCase.useCases = this.findAllBy({ids: useCaseIds || '0'});

    const mockRespIds = this.uc2mrs.findAll(useCase.id)
      .sort((a, b) => +(a.sequence > b.sequence))
      .map(el => el.mock_response_id).join(',');
    useCase.mockResponses = this.mockResp.findAllBy({ids: mockRespIds || '0'});

    return useCase;
  }

  findAllBy(by) {
    if (by.ids) {
      const sql = `SELECT * FROM use_cases WHERE id IN (${by.ids})`;
      console.log('[mock-responses] UseCaseService.findAllBy', sql);
      return this.db.prepare(sql).all();
    } else {
      const sql = 
        by.key ? `
          SELECT * FROM use_cases
          WHERE name LIKE '%${by.key}%' OR description like '%${by.key}%'
          ORDER BY updated_at DESC
        `: 
        by.except ? `
          SELECT * FROM use_cases
          WHERE id NOT IN (${by.except})
          ORDER BY updated_at DESC
        `:
        `SELECT * FROM use_cases ORDER BY updated_at DESC`;
      console.log('[mock-responses] UseCaseService.findAllBy', sql);

      const useCases = this.db.prepare(sql).all();
      useCases.forEach(useCase => {
        const useCaseIds = this.uc2ucs.findAll(useCase.id)
          .sort((a, b) => +(a.sequence > b.sequence))
          .map(el => el.child_use_case_id).join(',');
        useCase.useCases = this.findAllBy({ids: useCaseIds || '0'});

        const mockRespIds = this.uc2mrs.findAll(useCase.id)
          .sort((a, b) => +(a.sequence > b.sequence))
          .map(el => el.mock_response_id).join(',');
        useCase.mockResponses = this.mockResp.findAllBy({ids: mockRespIds || '0'});
      });

      return useCases;
    }
  }

  create(data: UseCase) {
    const name = data.name.trim().replace(/'/g, '\'\'');
    const description = data.description.trim().replace(/'/g, '\'\'');
    const UUID = require('uuid-int');
    const useCaseId = UUID(0).uuid();
    const createdAt = new Date().getTime();
    const sql = `
      INSERT INTO use_cases 
        VALUES (
          ${useCaseId}, '${name}', '${description}',
          ${createdAt}, '${username.sync()}', ${createdAt}, '${username.sync()}'
        );
      `;
    console.log('[mock-responses] UseCaseService use_cases create', sql);
    this.db.exec(sql);

    data.useCaseIds && this.uc2ucs.updateAllChildren(useCaseId, data.useCaseIds);
    data.mockResponseIds && this.uc2mrs.updateAllChildren(useCaseId, data.mockResponseIds);

    UseCaseCache.set(useCaseId);
    return BetterSqlite3.backupToSql();
  }

  update(id, data: UseCase) {
    if (data.name || data.description) {
      const columns = [];
      data.id && 
        columns.push(`id = '${data.id.toString().trim()}'`);
      data.name && 
        columns.push(`name = '${data.name.trim().replace(/'/g, '\'\'')}'`);
      data.description &&
        columns.push(`description = '${data.description.trim().replace(/'/g, '\'\'')}'`);
      const sql = `
        UPDATE use_cases SET
          ${columns.join(',\n')},
          updated_at = ${new Date().getTime()},
          updated_by = '${username.sync()}'
        WHERE id = ${id};
        `;
      console.log('[mock-responses] UseCaseService', sql);
      this.db.exec(sql);
    }

    data.useCaseIds && this.uc2ucs.updateAllChildren(data.id, data.useCaseIds);
    data.mockResponseIds && this.uc2mrs.updateAllChildren(data.id, data.mockResponseIds);

    delete UseCaseCache.data[id];
    UseCaseCache.set(id);
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

    delete UseCaseCache.data[id];
    return BetterSqlite3.backupToSql();
  }

  getCookie(req, key): string {
    const cookies = {};
    (req.headers.cookie || '').split('; ').forEach(el => {
      const [k,v] = el.split('=');
      cookies[k] = v;
    });
    return cookies[key] ? decodeURIComponent(cookies[key]) : undefined;
  }

  setCookie(req, res, key, value) {
    const matches = req.hostname.match(/[-\w]+\.(?:[-\w]+\.xn--[-\w]+|[-\w]{3,}|[-\w]+\.[-\w]{2})$/i);
    const topLevelDomain = (matches && matches[0]) || req.hostname;
    const cookieDomain = topLevelDomain.match(/\./) ? '.' + topLevelDomain : topLevelDomain;

    res.cookie(key, value, {
      path: '/',
      domain: cookieDomain,
      maxAge: 6048000 
    });
  }
}
