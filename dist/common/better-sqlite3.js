"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const sqlite3 = require("better-sqlite3");
const child_process_1 = require("child_process");
const better_sqlite3_migration_1 = require("./better-sqlite3-migration");
function runCommand(cmd) {
    console.log('[mock-responses] COMMAND: ', cmd);
    const cmds = cmd.split(' ');
    const child = child_process_1.execSync(cmd);
    child.error && console.log('[mock-responses] error', '' + child.error);
    child.stdout && console.log('[mock-responses] stdout ', '' + child.stdout);
    child.stderr && console.log('[mock-responses] stderr ', '' + child.stderr);
}
class BetterSqlite3 {
    static initialize(dbPath) {
        if (!fs.existsSync(dbPath)) {
            throw '[mock-respones] error. db path not found.';
        }
        console.log('[mock-responses] .................... constructing BetterSqlite3');
        const sqlPath = dbPath.replace(/\.sqlite3$/, '.sql');
        const sqlite3Path = dbPath.replace(/\.sql$/, '.sqlte3');
        if (fs.existsSync(sqlPath)) {
            BetterSqlite3.importFromSql(sqlPath, sqlite3Path);
        }
        else if (fs.existsSync(sqlite3Path)) {
            BetterSqlite3.exportToSql(sqlPath, sqlite3Path);
        }
        BetterSqlite3.db = new sqlite3(sqlite3Path);
        BetterSqlite3.dbPath = sqlite3Path;
        new better_sqlite3_migration_1.BetterSqlite3Migration().runAllMigration();
    }
    static importFromSql(sqlPath, sqlite3Path) {
        console.log('[mock-responses] .sql file found. re-creating .sqlite3 file from it', sqlPath);
        runCommand(`rm -f ${sqlite3Path}`);
        runCommand(`sqlite3 ${sqlite3Path} < ${sqlPath}`);
    }
    static exportToSql(sqlPath, sqlite3Path) {
        console.log('[mock-responses] .sqlite3 file found. creating .sql file from it', sqlPath);
        runCommand(`sqlite3 ${sqlite3Path} .dump > ${sqlPath}`);
    }
    static backupToSql() {
        clearTimeout(BetterSqlite3.backupToSqlTimer);
        BetterSqlite3.backupToSqlTimer = global.setTimeout(function () {
            const sqlPath = BetterSqlite3.dbPath.replace(/\.sqlite3/, '.sql');
            const command = `sqlite3 ${BetterSqlite3.dbPath} .dump > ${sqlPath}`;
            runCommand(command);
            console.log('[mock-responses] writing to .sql file', command);
        }, 60 * 1000);
    }
}
exports.BetterSqlite3 = BetterSqlite3;
BetterSqlite3.backupToSqlTimer = 0;
//# sourceMappingURL=better-sqlite3.js.map