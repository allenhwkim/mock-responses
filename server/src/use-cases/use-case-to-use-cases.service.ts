import { Injectable } from '@nestjs/common';
import { BetterSqlite3 } from '../common/better-sqlite3';

@Injectable()
export class UseCaseToUseCasesService {
  db = BetterSqlite3.db;

  /*
    id: integer
    use_case_id: integer
    child_use_case_id: integer
    sequence: integer
   */
  findAll(useCaseId) {
    const sql = `
      SELECT *
      FROM use_case_to_use_cases
      WHERE use_case_id = ${useCaseId}
      ORDER BY sequence
    `; 

    console.log('[mock-responses] UseCaseToUseCasesService findAll', sql);
    return this.db.prepare(sql).all();
  }

  updateAllChildren(useCaseId, useCaseIds) {
    const deleteSql = `DELETE FROM use_case_to_use_cases where use_case_id=${useCaseId}`;
    console.log('[mock-responses] UseCaseToUseCasesService updateAllChildren', deleteSql);
    this.db.exec(deleteSql);

    useCaseIds.forEach( (childUseCaseId, index) => {
      const insertSql = `
        INSERT INTO use_case_to_use_cases 
          (use_case_id, child_use_case_id, sequence)
          VALUES(${useCaseId}, ${childUseCaseId}, ${index+1})
      `;
      console.log('[mock-responses] UseCaseToUseCasesService updateAllChildren', insertSql);
      this.db.exec(insertSql);
    })

    return BetterSqlite3.backupToSql();
  }

  replaceUseCaseId(oldId, newId) {
    const updateSql = `UPDATE use_case_to_use_cases SET use_case_id = ${newId} where use_case_id=${oldId}`;
    console.log('[mock-responses] UseCaseToUseCasesService updateAllChildren', updateSql);
    this.db.exec(updateSql);
  }

}
