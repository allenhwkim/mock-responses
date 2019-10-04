export declare class BetterSqlite3 {
    static db: any;
    static dbPath: any;
    static backupToSqlTimer: any;
    static initialize(dbPath: any): void;
    static importFromSql(sqlPath: any, sqlite3Path: any): void;
    static exportToSql(sqlPath: any, sqlite3Path: any): void;
    static backupToSql(): void;
}
