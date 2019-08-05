const path = require('path');
const fs = require('fs');
const sqlite3 = require('better-sqlite3');
const username = require('username').sync();
const {execSync} = require('child_process');

function isFunc(code) {
  try {
    new Function(`return ${code}`);
  } catch(e) {
    console.error('[mock-responses] function error', e, code);
    return false;
  }
  return true;
}

function runCommand(cmd) {
  console.log('[mock-responses] COMMAND: ', cmd);
  const cmds = cmd.split(' ');
  const child = execSync(cmd, [], {env:{PATH: process.env.PATH}});
  child.error && console.log('[mock-responses] error', '' + child.error);
  child.stdout && console.log('[mock-responses] stdout ', '' + child.stdout);
  child.stderr && console.log('[mock-responses] stderr ', '' + child.stderr); 
}

const DB = {
  set sqlite3Path(path) {
    DB.__sqlite3Path = path;
    const sqlFile = path.replace(/\.sqlite3/, '.sql');
    const sqlite3File = path.replace(/\.sql$/, '.sqlite3');
    // if sql file founc, re-create sqlite3 file from it
    if (fs.existsSync(sqlFile))  {
      console.log('.sql file found. re-creating .sqlite3 file from it', sqlFile);
      runCommand(`rm -f ${sqlite3File}`);
      runCommand(`sqlite3 ${sqlite3File} < ${sqlFile}`)
    } 
    // if sqlite3 file founc, create sql file from it
    else if (fs.existsSync(sqlite3File)) {
      console.log('.sqlite3 file found. creating .sql file from it', sqlFile);
      runCommand(`sqlite3 ${sqlite3File} .dump > ${sqlFile}`)
    }
    DB.sqlite3 = new sqlite3(sqlite3File);
    require('./migration.js'); // migration script
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
  if (key && key !== 'undefined' && key.indexOf('*') === -1) {
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

  const deactivateSql = `UPDATE mock_responses SET active = 0 WHERE req_url = '${data.req_url}'`;
  DB.sqlite3.exec(deactivateSql); //this is not critical, insertion should happen even if this fails

  console.log('[mock-responses]', sql)
  const result = DB.sqlite3.exec(sql) ? 'inserted' : 'error';
  DB.backupToSql();
  return result;
};

DB.updateMockResponse = function(data) {
  const updatedAt = new Date().getTime();
  const reqMethod = data.req_method ? `'${data.req_method}'` : 'NULL'; 
  const reqName = data.name ? `'${data.name}'` : 'NULL';
  const resDelaySec = data.res_delay_sec ? data.res_delay_sec : 'NULL';
  data.res_content_type === 'text/javascript' && isFunc(data.res_body);

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
  const result = DB.sqlite3.exec(sql) ? 'updated' : 'error';
  DB.backupToSql();
  return result;
};

DB.activateMockResponse = function(id) {
  const data = DB.getMockResponse(id);
  const deactivateSql = `UPDATE mock_responses SET active = 0 WHERE id <> ${id} AND req_url = '${data.req_url}'`;
  const active = data.active ? 0 : 1; 
  const activateSql = `UPDATE mock_responses SET active = ${active} WHERE id = ${id}`;

  console.log('[mock-responses]', deactivateSql, activateSql)
  const result = DB.sqlite3.exec(deactivateSql) 
    && DB.sqlite3.exec(activateSql) ? 'activated' : 'error';
  DB.backupToSql();
  return result;
};

DB.deleteMockResponse = function(id) {
  const sql = `DELETE FROM mock_responses where id=${id}`;

  console.log('[mock-responses]', sql);
  const result = DB.sqlite3.exec(sql) ? 'deleted' : 'error';
  DB.backupToSql();
  return result;
};

DB.backupToSqlTimer = 0;
DB.backupToSql = function() {
  clearTimeout(DB.backupToSqlTimer);
  // Run this every 1 minute
  DB.backupToSqlTimer = setTimeout(function () {
    const sqlFile = DB.__sqlite3Path.replace(/\.sqlite3/, '.sql');
    const sqlite3File = DB.__sqlite3Path.replace(/\.sql$/, '.sqlite3');
    const command = `sqlite3 ${sqlite3File} .dump > ${sqlFile}`;
    runCommand(command);
    console.log('[mock-responses] writing to .sql file', command);
  }, 60*1000);
}

module.exports = DB;
