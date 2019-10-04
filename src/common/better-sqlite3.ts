import * as fs from 'fs';
import * as path  from 'path';
import * as sqlite3 from 'better-sqlite3';
import { execSync } from 'child_process';
import { BetterSqlite3Migration } from './better-sqlite3-migration';

function runCommand(cmd) {
  console.log('[mock-responses] COMMAND: ', cmd);
  const cmds = cmd.split(' ');
  const child: any = execSync(cmd);
  child.error && console.log('[mock-responses] error', '' + child.error);
  child.stdout && console.log('[mock-responses] stdout ', '' + child.stdout);
  child.stderr && console.log('[mock-responses] stderr ', '' + child.stderr); 
}

export class BetterSqlite3 {
  static db;
  static dbPath;
  static backupToSqlTimer: any = 0;

  static initialize(dbPath) {
    if (!fs.existsSync(dbPath)) {
      throw '[mock-respones] error. db path not found.';
    }

    console.log('[mock-responses] .................... constructing BetterSqlite3')
    const sqlPath = dbPath.replace(/\.sqlite3$/, '.sql'); 
    const sqlite3Path = dbPath.replace(/\.sql$/, '.sqlite3'); 

    if (fs.existsSync(sqlPath)) {
      BetterSqlite3.importFromSql(sqlPath, sqlite3Path);
    } else if (fs.existsSync(sqlite3Path)) {
      BetterSqlite3.exportToSql(sqlPath, sqlite3Path);
    }

    BetterSqlite3.db = new sqlite3(sqlite3Path);
    BetterSqlite3.dbPath = sqlite3Path;
    new BetterSqlite3Migration().runAllMigration();
  }

  static importFromSql(sqlPath, sqlite3Path) {
    console.log('[mock-responses] .sql file found. re-creating .sqlite3 file from it', sqlPath);
    runCommand(`rm -f ${sqlite3Path}`);
    runCommand(`sqlite3 ${sqlite3Path} < ${sqlPath}`)
  }

  static exportToSql(sqlPath, sqlite3Path) {
    console.log('[mock-responses] .sqlite3 file found. creating .sql file from it', sqlPath);
    runCommand(`sqlite3 ${sqlite3Path} .dump > ${sqlPath}`)
  }

  static backupToSql() {
    clearTimeout(BetterSqlite3.backupToSqlTimer);
    // Run this every 1 minute
    BetterSqlite3.backupToSqlTimer = global.setTimeout(function () {
      const sqlPath = BetterSqlite3.dbPath.replace(/\.sqlite3/, '.sql');
      const command = `sqlite3 ${BetterSqlite3.dbPath} .dump > ${sqlPath}`;
      runCommand(command);
      console.log('[mock-responses] writing to .sql file', command);
    }, 60*1000);
  }

}
