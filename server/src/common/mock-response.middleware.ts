import * as path from 'path';
import * as fs from 'fs';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

import { BetterSqlite3 } from './better-sqlite3';
import { MockResponse } from './interfaces/mock-response.interface';
import { UseCaseCache } from './use-case-cache';
import { REQUEST } from '@nestjs/core';

function findMockResponse(req: Request): MockResponse {
  // const row: MockResponse = findByUrlMethod(req.path, req.method);
  const { activeUseCases, activeMockResponses, availableMockResponses }
    = UseCaseCache.getAvailableMockResponses(req);
  const getREMatchingUrlMethods = function(url) {
    for (const key in UseCaseCache.data['REG_EXP']) {
      if (url.match(new RegExp(key))) {
        const url =  UseCaseCache.data['REG_EXP'][key];
        return UseCaseCache[url];
      }
    }
  }
  const urlMethods = availableMockResponses[req.path] || getREMatchingUrlMethods(req.path);

  const mockResponse = 
    availableMockResponses[req.path][req.method] || // exact method
    availableMockResponses[req.path]['*'];  // any method
  
  return mockResponse;
}

export async function serveMockResponse(req: Request, res: Response, next: Function) {
  // ignore all OPTIONS call
  if (req.method === 'OPTIONS') {
    res.end();
    return;
  }

  if ( // application-specific reserved urls e.g., /use-cases/index
    req.url.startsWith('/developer') || 
    req.url.startsWith('/mock-responses') ||
    req.url.startsWith('/use-cases') 
  ) {
    next();
    return;
  } 

  !UseCaseCache.data[0] && UseCaseCache.setDefault();
  const mockResp = findMockResponse(req);

  // if not found in DB, continue
  if (!mockResp) {
    next();
    return;
  }

  if (mockResp.req_payload) {
    const missingPayload = mockResp.req_payload.split(',').map(el => el.trim())
      .filter(payload => payload && typeof req.body[payload] === 'undefined');
    if (missingPayload.length) {
      // if payload not satisfied
      res.status(422).send(`payload not matching, ${mockResp.req_payload}`);
      return;
    }
  } 

  // delay response if specified
  const delaySec = mockResp.res_delay_sec || 0;
  if (delaySec) {
    console.log(`[mock-responses] Delaying ${delaySec} seconds`);
    await new Promise(resolve => setTimeout(_ => resolve(), delaySec * 1000));
  }

  if ((mockResp.res_body||'').match(/^file:\/\//)) {
    // if serve from file, e.., file://yyyy.xxxx.js
    const filePath = path.join(
      path.dirname(BetterSqlite3.dbPath),
      mockResp.res_body.replace('file://', '')
    );
    if (!fs.existsSync(filePath)) {
      res.status(404).send();
      return;
    }
    res.setHeader('Content-Type', mockResp.res_content_type);
    const body = fs.readFileSync(filePath, 'utf8');
    res.status(mockResp.res_status).send(body);
    return;
  }

  else if (mockResp.res_content_type === 'function') {
    // if serve from function
    console.log('[mock-responses] Serving from function' , mockResp.res_body);
    const mockRespId = (new Function('req', 'res', 'next', mockResp.res_body))(req, res, next);
    const sql = `SELECT * FROM mock_responses WHERE id = ${mockRespId} LIMIT 1`;
    const dynMockResp = BetterSqlite3.db.prepare(sql).get();

    if (dynMockResp) {
      res.setHeader('Content-Type', dynMockResp.res_content_type);
      res.status(dynMockResp.res_status).send(dynMockResp.res_body);
      return;
    } else {
      console.log('[mock-responses] Cannot find id', mockRespId);
    }
  } 

  else if (mockResp) {
    // if serve from body contents
    res.setHeader('Content-Type', mockResp.res_content_type);
    res.status(mockResp.res_status).send(mockResp.res_body);
    return;
  }

  console.log('Noooooooooooooooooooooo you shouldn\'t see this' , mockResp);
}
