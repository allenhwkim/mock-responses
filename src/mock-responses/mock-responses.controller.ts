import {
  Body, Controller, Delete, Get, Header,
  HttpException, HttpStatus, Param, Post,
  Put, Query, Redirect, Render, Request, Res,
} from '@nestjs/common';
import { MockResponsesService } from './mock-responses.service';
import { MockResponse } from '../common/interfaces';

@Controller('mock-responses')
export class MockResponsesController {

  constructor(private mockResp: MockResponsesService) {
  }

  @Get('index')
  @Render('mock-responses-list')
  index(@Query('q') key) {
    const grouped = this.findAllBy(key);
    return { grouped };
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
        active: row.active || false,
        req_url: row.req_url || '',
        req_method: row.req_method || 'POST',
        req_payload: row.req_payload || '',
        res_status: row.res_status || 200,
        res_delay_sec: row.res_delay_sec || 0,
        res_content_type: row.res_content_type || 'application/json',
        res_body: row.res_body || ''
      } 
    };
  }

  @Get()
  findAllBy(@Query('q') key) {
    const mockResponses = {};

    const apiGrouped = this.mockResp.findAllBy({ apiGroup: 1, key });
    apiGrouped.forEach(({req_url, updated_at, count}) => {
      const data = this.mockResp.findAllBy({req_url});
      const id = data[0].id;
      mockResponses[req_url] = { id, updated_at: new Date(updated_at), count, data };
    })

    return mockResponses;
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

  @Put(':id/activate')
  activate(@Param() params) {
    return this.mockResp.activate(params.id);
  }

  @Delete(':id')
  delete(@Param() params) {
    return this.mockResp.delete(params.id);
  }
}
