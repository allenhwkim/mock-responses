import * as path from 'path';
import { BetterSqlite3 } from './better-sqlite3';

export class BetterSqlite3Migration {
  db: any;

  runAllMigration() {
    this.db = BetterSqlite3.db;
    this.createMockResponses();
    this.createUseCases();
    this.createUseCaseToUseCases();
    this.createUseCaseToMockResponses();
    this.rebuildMockResponses();
    this.rebuildUseCases();
  }

  createMockResponses() {
    try {
      this.db.exec('select * from mock_responses limit 1');
    } catch(e) {
      console.log('[mock-responses] running migration for creating mock_responses');
      const sql = `
        CREATE TABLE IF NOT EXISTS mock_responses (
          id	INTEGER,
          name	TEXT DEFAULT 'Unnamed',
          req_url	TEXT,
          req_method	TEXT DEFAULT 'GET',
          res_status	INTEGET DEFAULT 200,
          res_delay_sec	INTEGER,
          res_content_type	TEXT DEFAULT 'application/json',
          res_body	BLOB,
          created_at	INTEGER,
          created_by	string,
          updated_at	INTEGER,
          updated_by	string,
          req_payload	TEXT,
          PRIMARY KEY(id)
        );
      `;

      this.db.exec(sql);
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
          description TEXT NOT NULL
        )
      `;

      this.db.exec(sql);
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

  // this is for table created with active column
  rebuildMockResponses() {
    try {
      this.db.exec('select active from mock_responses limit 1');
      console.log('[mock-responses] running migration for deleting active column from mock-responses');
      const sql = `
        BEGIN TRANSACTION;
        ALTER TABLE mock_responses RENAME TO mock_responses_old;
        CREATE TABLE mock_responses (
          id	INTEGER,
          name	TEXT DEFAULT 'Unnamed',
          req_url	TEXT,
          req_method	TEXT DEFAULT 'GET',
          req_payload	TEXT,
          res_status	INTEGET DEFAULT 200,
          res_delay_sec	INTEGER,
          res_content_type	TEXT DEFAULT 'application/json',
          res_body	BLOB,
          created_at	INTEGER,
          created_by	string,
          updated_at	INTEGER,
          updated_by	string,
          PRIMARY KEY(id)
        );
        INSERT INTO mock_responses 
          SELECT 
            id, name, req_url, req_method, req_payload,
            res_status, res_delay_sec, res_content_type, res_body,
            created_at, created_by, updated_at, updated_by
          FROM mock_responses_old;
        DROP TABLE mock_responses_old;
        COMMIT;
      `;
      this.db.exec(sql);
    } catch(e) {
    }
  }

  rebuildUseCases() {
    try {
      this.db.exec('select category from use_cases limit 1');
      console.log('[mock-responses] running migration for deleting columns for use_cases');
      const sql = `
        BEGIN TRANSACTION;
        ALTER TABLE use_cases RENAME TO use_cases_old;
        CREATE TABLE use_cases (
          id  INTEGER PRIMARY KEY,
          name  TEXT NOT NULL,
          description TEXT NOT NULL,
          created_at	INTEGER,
          created_by	string,
          updated_at	INTEGER,
          updated_by	string,
        );
        INSERT INTO use_cases
          SELECT id, name, description
          FROM use_cases_old;
        DROP TABLE use_cases_old;
        COMMIT;
      `;
      this.db.exec(sql);
    } catch(e) {
    }
  }

}
