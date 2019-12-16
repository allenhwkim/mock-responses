import * as path from 'path';
import * as fs from 'fs';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

import { BetterSqlite3 } from './better-sqlite3';
import { MockResponse } from './interfaces/mock-response.interface';

function hasAllPayload(body, payload) {
  const payloads = payload.split(',');
  for (var i=0; i < payloads.length; i++) {
    var el = payloads[i].trim();
    if (el && typeof body[el] === 'undefined') {
      return false;
    }
  }
  return true;
}

function findByUrlMethod(url, method) {
  const sql1 = `
    SELECT * 
    FROM mock_responses 
    WHERE req_url = '${url}' 
      AND (req_method = '${method}' OR req_method IS NULL)
      AND active = 1
    ORDER BY req_url is NULL
    LIMIT 1`;
  return BetterSqlite3.db.prepare(sql1).get();
}

function findById(id) {
  const sql1 = `SELECT * FROM mock_responses WHERE id = ${id} LIMIT 1`;
  return BetterSqlite3.db.prepare(sql1).get();
}

function delay(ms) {
  return new Promise(resolve => setTimeout(_ => resolve(), ms));
}

export async function serveMockResponse(req: Request, res: Response, next: Function) {
  // ignore all OPTIONS call
  if (req.method === 'OPTIONS') {
    res.end();
    return;
  }

  // if (req.url === "/" || req.url.startsWith("/developer") || req.url.startsWith("/mock-responses")) {
  //   next();
  //   return false; // next();
  // } 

  const now = Date.now();
  const row: MockResponse = findByUrlMethod(req.path, req.method);

  // if not found in DB, continue
  if (!row) {
    next();
    return;
  }

  // if payload not given, return 422 error
  const delaySec = row.res_delay_sec || 0;
  if (delaySec) {
    console.log(`[mock-responses] Delaying ${delaySec} seconds`);
    await delay(delaySec * 1000);
  }

  if (row.req_payload && !hasAllPayload(req.body, row.req_payload)) {
    res.status(422).send(`payload not matching, ${row.req_payload}`);
    return;
  } 
  // if serve from file
  else if ((row.res_body||'').match(/^file:\/\//)) { // file://yyyy.xxxx.js
    const filePath = path.join(
      path.dirname(BetterSqlite3.dbPath),
      row.res_body.replace('file://', '')
    );
    if (!fs.existsSync(filePath)) {
      res.status(404).send();
      return;
    }
    res.setHeader('Content-Type', row.res_content_type);
    const body = fs.readFileSync(filePath, 'utf8');
    res.status(row.res_status).send(body);
    return;
  }  // `return req.query.foo === 1 ? 10 : 12;`
  else if (row.res_content_type === 'function') {
    console.log('[mock-responses] Serving from function' , row.res_body);
    const rowId = (new Function('req', 'res', 'next', row.res_body))(req, res, next);
    const dynRow = findById(rowId);
    if (dynRow) {
      res.setHeader('Content-Type', dynRow.res_content_type);
      res.status(dynRow.res_status).send(dynRow.res_body);
      return;
    } else {
      console.log('[mock-responses] Cannot find id', rowId);
    }
  }  // if serve from body contents
  else if (row) {
    res.setHeader('Content-Type', row.res_content_type);
    res.status(row.res_status).send(row.res_body);
    return;
  }

  console.log('Noooooooooooooooooooooo you shouldn\'t see this' , row);
}
