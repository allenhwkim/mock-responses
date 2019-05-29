const path = require('path');
const sqlite3 = require('better-sqlite3');
const username = require('username').sync();

function isFunc(code) {
  try {
    new Function(`return ${code}`);
  } catch(e) {
    console.error('[mock-responses] function error', e, code);
    return false;
  }
  return true;
}

const DB = {
  set sqlite3Path(path) {
    DB.__sqlite3Path = path;
    DB.sqlite3 = new sqlite3(path);
  }
};

DB.activateByName = function(key) {
  if (!key) return false;

  const deactivateSql = `UPDATE mock_responses SET active = 0 WHERE req_url IN (SELECT req_url FROM mock_responses WHERE name = '${name}') `;
  DB.sqlite3.exec(deactivateSql);

  const activateSql = `UPDATE mock_responses SET active = '1' WHERE name ='${key}'`;
  return DB.sqlite3.exec(activateSql);
};

DB.getById = function(id) {
  return DB.sqlite3.prepare(`SELECT * FROM mock_responses WHERE id = ${id}`).get();
};

DB.getByRequest = function(req) {
  const req_url = req.url.match(/([\/\w-.]+)/)[0];
  const sql1 = `
    SELECT * 
    FROM mock_responses 
    WHERE req_url = '${req_url}' 
      AND req_method = '${req.method}'
      AND active = 1
    LIMIT 1
  `;
  const sql2 = `
    SELECT * 
    FROM mock_responses 
    WHERE req_url = '${req_url}' 
      AND req_method IS NULL
      AND active = 1
    LIMIT 1
  `;
  return DB.sqlite3.prepare(sql1).get() || DB.sqlite3.prepare(sql2).get();
};

DB.getUniqueNames = function() {

  let sql = `SELECT DISTINCT name FROM mock_responses`;

  console.log('[mock-responses]', sql)
  return DB.sqlite3.prepare(sql).all();
};

DB.getMockResponses = function(key) {
  let sql = `SELECT * FROM mock_responses`;
  if (key !== 'undefined' && key.indexOf('*') === -1) {
    sql += ` WHERE name like '%${key}%' OR req_url like '%${key}%' OR res_body like '%${key}%' `;
  }
  sql += ' ORDER BY req_url, updated_at DESC';

  console.log('[mock-responses]', sql)
  return DB.sqlite3.prepare(sql).all();
};

DB.getMockResponse = function(id) {
  const sql = `SELECT * FROM mock_responses WHERE id = ?`;

  console.log('[mock-responses]', sql)
  return DB.sqlite3.prepare(sql).get(id);
};

DB.insertMockResponse = function(data) {
  try {
    data.res_body = JSON.stringify(JSON.parse(data.res_doby), null, '  '); 
  } catch(e) {}

  const createdAt = new Date().getTime();

  const reqMethod = data.req_method ? `'${data.req_method}'` : 'NULL'; 

  const reqName = data.name ? `'${data.name}'` : 'NULL';
  const resDelaySec = data.res_delay_sec ? data.res_delay_sec : 'NULL';
  data.res_content_type === 'text/javascript' && isFunc(data.res_body);
  const resBody = data.res_body.replace(/'/g,'\'\'');
  const sql = `
    INSERT INTO mock_responses(name, active, 
      req_url, req_method, req_payload,
      res_status, res_delay_sec,
      res_content_type, res_body,
      created_at, created_by, updated_at, updated_by
      ) VALUES 
      (
       ${reqName}, ${data.active}, 
      '${data.req_url}', ${reqMethod}, '${data.req_payload}',
       ${data.res_status}, ${resDelaySec},
      '${data.res_content_type}', '${resBody}',
       ${createdAt}, '${username}', ${createdAt}, '${username}'
      )
    `;
        
  console.log('[mock-responses]', sql)
  return DB.sqlite3.exec(sql) ? 'inserted' : 'error';
};

DB.updateMockResponse = function(data) {
  const updatedAt = new Date().getTime();
  const reqMethod = data.req_method ? `'${data.req_method}'` : 'NULL'; 
  const reqName = data.name ? `'${data.name}'` : 'NULL';
  const resDelaySec = data.res_delay_sec ? data.res_delay_sec : 'NULL';
  data.res_content_type === 'text/javascript' && isFunc(data.res_body);

  console.log('.........................', data);
  const resBody = data.res_body.replace(/'/g,'\'\'');
  const sql = `
    UPDATE mock_responses SET
      name = ${reqName},
      active = ${data.active},
      req_url = '${data.req_url}',
      req_method = ${reqMethod},
      req_payload = '${data.req_payload}',
      res_status = ${data.res_status},
      res_delay_sec = ${resDelaySec},
      res_content_type = '${data.res_content_type}',
      res_body =  '${resBody}',
      updated_at = ${updatedAt},
      updated_by = '${username}'
    WHERE id = ${data.id};
    `;

  console.log('[mock-responses]', sql)
  return DB.sqlite3.exec(sql) ? 'updated' : 'error';
};

DB.activateMockResponse = function(id) {
  const data = DB.sqlite3.getMockResponse(id);
  const deactivateSql = `UPDATE mock_responses SET active = 0 WHERE id <> ${id} AND req_url = '${data.req_url}'`;
  const active = data.active ? 0 : 1; 
  const activateSql = `UPDATE mock_responses SET active = ${active} WHERE id = ${id}`;

  console.log('[mock-responses]', deactivateSql, activateSql)
  return DB.sqlite3.exec(deactivateSql) 
    && DB.sqlite3.exec(activateSql) ? 'activated' : 'error';
};

DB.deleteMockResponse = function(id) {
  const sql = `DELETE FROM mock_responses where id=${id}`;

  console.log('[mock-responses]', sql);
  return DB.sqlite3.exec(sql) ? 'deleted' : 'error';
};

module.exports = DB;
