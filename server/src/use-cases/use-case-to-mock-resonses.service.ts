import { Injectable } from '@nestjs/common';
import { BetterSqlite3 } from '../common/better-sqlite3';

@Injectable()
export class UseCaseToMockResponsesService {
  db = BetterSqlite3.db;

  /*
    id: integer
    use_case_id: integer
    mock_response_id: integer
    sequence: integer
   */
  findAll(useCaseId) {
    const sql = `
      SELECT *
      FROM use_case_to_mock_responses
      WHERE use_case_id = ${useCaseId}
      ORDER BY sequence
    `; 

    console.log('[mock-responses] UseCaseToMockResponsesService findAll', sql);
    return this.db.prepare(sql).all();
  }

  updateAllChildren(useCaseId, mockResponseIds) {
    const deleteSql = `DELETE FROM use_case_to_mock_responses where use_case_id=${useCaseId}`;
    console.log('[mock-responses] UseCaseToMockResponsesService updateAllChildren', deleteSql);
    this.db.exec(deleteSql);

    mockResponseIds.forEach( (mockResponseId, index) => {
      const insertSql = `
        INSERT INTO use_case_to_mock_responses 
          (use_case_id, mock_response_id, sequence)
          VALUES(${useCaseId}, ${mockResponseId}, ${index+1})
      `;
      console.log('[mock-responses] UseCaseToMockResponsesService updateAllChildren', insertSql);
      this.db.exec(insertSql);
    })

    return BetterSqlite3.backupToSql();
  }

}
