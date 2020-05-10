import {
  Body, Controller, Delete, Get, Param, Post, Put, Query, Render, Request,
} from '@nestjs/common';
import { MockResponsesService } from './mock-responses.service';
import { MockResponse } from '../common/interfaces';
import { UseCasesService } from '../use-cases/use-cases.service';

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

  @Get('index')
  @Render('mock-responses-list')
  index(
    @Query('q') key,
    @Query('ids') ids,
    @Query('active') active,
    @Request() req
  ) {
    const activeUseCase = this.useCase.cookies(req, 'UCID');
    const mockResponses = this.mockResp.findAllBy({key, ids, active});
    const useCaseIds = active ? this.useCase.find(active).use_cases : '';
    const useCases  = useCaseIds ? this.useCase.findAllBy({ids: useCaseIds}) : [];
    return { mockResponses, useCases, activeUseCase, key};
  }

  @Get(':id/edit')
  @Render('mock-responses-edit')
  edit(@Param() params) {
    const mockResponse: MockResponse = this.mockResp.find(params.id);
    return { mockResponse };
  }

  @Get('new')
  @Render('mock-responses-edit')
  new(@Query('from') from) {
    const row = from ? this.mockResp.find(from) : {};
    return { 
      mockResponse: {
        name: row.name || '',
        req_url: row.req_url || '',
        req_method: row.req_method || 'POST',
        req_payload: row.req_payload || '', res_status: row.res_status || 200,
        res_delay_sec: row.res_delay_sec || 0,
        res_content_type: row.res_content_type || 'application/json',
        res_body: row.res_body || ''
      } 
    };
  }

  @Get(':id')
  findOne(@Param() params) {
    return this.mockResp.find(params.id);
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

}
