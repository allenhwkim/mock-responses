"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const better_sqlite3_1 = require("./better-sqlite3");
class BetterSqlite3Migration {
    runAllMigration() {
        this.db = better_sqlite3_1.BetterSqlite3.db;
        this.addResDelaySec();
        this.addCreatedAtUpdatedAt();
        this.addReqPayload();
        this.createUseCases();
    }
    addResDelaySec() {
        try {
            this.db.exec('select res_delay_sec from mock_responses limit 1');
        }
        catch (e) {
            console.log('[mock-responses] running migration for res_delay_sec');
            this.db.exec('ALTER TABLE mock_responses ADD COLUMN res_delay_sec integer');
        }
    }
    addCreatedAtUpdatedAt() {
        try {
            this.db.exec('select created_at from mock_responses limit 1');
        }
        catch (e) {
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
        }
        catch (e) {
            console.log('[mock-responses] running migration for req_payload');
            this.db.exec('ALTER TABLE mock_responses ADD COLUMN req_payload TEXT');
        }
    }
    createUseCases() {
        try {
            this.db.exec('select * from use_cases limit 1');
        }
        catch (e) {
            console.log('[mock-responses] running migration for creating use_cases');
            const sql = `
        CREATE TABLE use_cases (
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
}
exports.BetterSqlite3Migration = BetterSqlite3Migration;
//# sourceMappingURL=better-sqlite3-migration.js.map