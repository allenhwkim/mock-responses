import * as path from 'path';
import { BetterSqlite3 } from './better-sqlite3';

export class BetterSqlite3Migration {
  db: any;

  runAllMigration() {
    this.db = BetterSqlite3.db;
    this.addResDelaySec();
    this.addCreatedAtUpdatedAt();
    this.addReqPayload();
    this.createUseCases();
    this.createUseCaseToUseCases();
    this.createUseCaseToMockResponses();
  }

  addResDelaySec() {
    try {
      this.db.exec('select res_delay_sec from mock_responses limit 1');
    } catch(e) {
      console.log('[mock-responses] running migration for res_delay_sec');
      this.db.exec('ALTER TABLE mock_responses ADD COLUMN res_delay_sec integer DEFAULT 0');
    }
  }

  addCreatedAtUpdatedAt() {
    try {
      this.db.exec('select created_at from mock_responses limit 1');
    } catch(e) {
      console.log('[mock-responses] running migration for created_at');
      this.db.exec('ALTER TABLE mock_responses ADD COLUMN created_at INTEGER');
      this.db.exec('ALTER TABLE mock_responses ADD COLUMN created_by string');
      this.db.exec('ALTER TABLE mock_responses ADD COLUMN updated_at INTEGER');
      this.db.exec('ALTER TABLE mock_responses ADD COLUMN updated_by string');
    }
  }

  addReqPayload() {
    try {
      this.db.exec('select req_payload from mock_responses limit 1');
    } catch(e) {
      console.log('[mock-responses] running migration for req_payload');
      this.db.exec('ALTER TABLE mock_responses ADD COLUMN req_payload TEXT');
    }
  }

  createUseCases() {
    try {
      this.db.exec('select * from use_cases limit 1');
    } catch(e) {
      console.log('[mock-responses] running migration for creating use_cases');
      const sql =`
        CREATE TABLE IF NOT EXISTS use_cases (
          id  INTEGER PRIMARY KEY,
          name  TEXT NOT NULL,
          description TEXT NOT NULL,
          mock_responses TEXT
        )
      `;

      this.db.exec(sql);
      this.db.exec(`INSERT INTO use_cases (name, description, mock_responses) VALUES ('test', 'desc', '1,2,3')`);
    }
  }

  createUseCaseToUseCases() {
    try {
      this.db.exec('select * from use_case_to_use_cases limit 1');
    } catch(e) {
      console.log('[mock-responses] running migration for creating use_case_to_use_cases');
      const sql =`
        CREATE TABLE IF NOT EXISTS use_case_to_use_cases (
          id  INTEGER PRIMARY KEY,
          use_case_id INTEGER NOT NULL,
          child_use_case_id INTEGER NOT NULL,
          sequence INTEGER NOT NULL
        )
      `;
      this.db.exec(sql);
    }
  }

  createUseCaseToMockResponses() {
    try {
      this.db.exec('select * from use_case_to_mock_responses limit 1');
    } catch(e) {
      console.log('[mock-responses] running migration for creating use_case_to_mock_responses');
      const sql =`
        CREATE TABLE IF NOT EXISTS use_case_to_mock_responses (
          id  INTEGER PRIMARY KEY,
          use_case_id INTEGER NOT NULL,
          mock_response_id INTEGER NOT NULL,
          sequence INTEGER NOT NULL
        )
      `;
      this.db.exec(sql);
    }
  }
}

