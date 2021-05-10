import {
  Body, Controller, Delete, Get, Param, Post, Put, Query, Request, Response, Headers, Header
} from '@nestjs/common';
import { MockResponsesService } from './mock-responses.service';
import { MockResponse, ArchiveData } from '../common/interfaces';
import { UseCasesService } from '../use-cases/use-cases.service';
import { CookieService } from '../common/cookie-service';

function cookies(req) {
  const cookies = {};
  (req.headers.cookie || '').split('; ').forEach(el => {
    const [k,v] = el.split('=');
    cookies[k] = v;
  });
  return cookies;
}

@Controller('mock-responses')
export class MockResponsesController {

  constructor(
    private useCase: UseCasesService, 
    private mockResp: MockResponsesService
  ) {}

  @Get()
  findAllBy(@Query('q') key, @Query('ids') ids) {
    const mockResponses = this.mockResp.findAllBy({key, ids});
    return { mockResponses, key};
  }

  @Get(':id')
  findOne(@Param() params) {
    return this.mockResp.find(params.id);
  }

  @Get('last-archived/:username')
  findLastArchived(@Param() params, @Headers() headers, @Response() res) {
    if (headers['req-domain-name'] === 'localhost') {
      const resp = this.mockResp.lastArchived(params.username);
      res.send(resp);
      res.end();
      // return JSON.parse(resp);
    } else {
      return res.status(403).send({error: 'invalid request. Must be from localhost server(not browser)'});
    }
  }

  @Post('archive')
  archive(@Body() data: ArchiveData, @Headers() headers, @Response() res) {
console.log('}}}}}}}}}}}}}}}}}}}}}}}}{{{{{{{{{{', {data})
    if (headers['req-domain-name'] === 'localhost') {
      const resp = this.mockResp.archive(data.userName, data.mockResponse);
      res.send(resp);
      res.end();
    } else {
      return res.status(403).send({error: 'same host'});
    }
  }

  @Post()
  create(@Body() data: MockResponse) {
    return this.mockResp.create(data);
  }

  @Put(':id')
  update(@Body() data: MockResponse) {
    return this.mockResp.update(data);
  }

  @Delete(':id')
  delete(@Param() params) {
    return this.mockResp.delete(params.id);
  }

  @Put(':id/activate')
  activate(@Param() params, @Response() res, @Request() req) {
    const activeMockResponses = (CookieService.getCookie(req, 'MRIDS') || '')
      .split(',').filter(el => el).map(el => +el);
    const mockResponse: MockResponse = this.mockResp.find(+params.id);
    if (mockResponse) {
      const newActiveMockResponses = [...activeMockResponses, mockResponse.id];
      CookieService.setCookie(req, res, 'MRIDS', newActiveMockResponses.join(','));
      res.send(newActiveMockResponses);
    } else {
      res.send(activeMockResponses);
    }
  }

  @Put(':id/deactivate')
  deactivate(@Param() params, @Response() res, @Request() req) {
    const activeMockResponses = (CookieService.getCookie(req, 'MRIDS') || '')
      .split(',').filter(el => el).map(el => +el)
    const mockResponse: MockResponse = this.mockResp.find(+params.id);
    if (mockResponse) {
      const newActiveMockResponses = activeMockResponses.filter(el => +el !== +params.id);
      CookieService.setCookie(req, res, 'MRIDS', newActiveMockResponses.join(','));
      res.send(newActiveMockResponses);
    } else {
      res.send(activeMockResponses);
    }
  }
}
