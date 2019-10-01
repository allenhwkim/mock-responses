const path = require('path');
const DB = require(path.join(__dirname, 'database.js'));
const db = DB.sqlite3;

/** 
 *   mock_responses columns
 * id
 * name
 * active
 * req_url
 * req_method
 * req_payload
 * res_status
 * res_delay_sec
 * res_content_type
 * res_body
 * created_at
 * created_by
 * updated_at
 * updated_by
 */

// res_delay_sec
try {
  db.exec('select res_delay_sec from mock_responses limit 1');
} catch(e) {
  db.exec('ALTER TABLE mock_responses ADD COLUMN res_delay_sec integer');
}

// created_at
// created_by
// updated_at
// updated_by
try {
  db.exec('select created_at from mock_responses limit 1');
} catch(e) {
  db.exec('ALTER TABLE mock_responses ADD COLUMN created_at INTEGER');
  db.exec('ALTER TABLE mock_responses ADD COLUMN created_by string');
  db.exec('ALTER TABLE mock_responses ADD COLUMN updated_at INTEGER');
  db.exec('ALTER TABLE mock_responses ADD COLUMN updated_by string');
}

// req_method
try {
  db.exec(`UPDATE mock_responses SET req_method = NULL WHERE req_method = ''`);
} catch(e) {
  // do nothing
}


// req_payload
try {
  db.exec('select req_payload from mock_responses limit 1');
} catch(e) {
  db.exec('ALTER TABLE mock_responses ADD COLUMN req_payload TEXT');
}

