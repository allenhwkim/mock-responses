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
    const mockResponses = this.mockResp.findAll(key);
    return { mockResponses };
  }

  @Get('edit/:id')
  @Render('mock-responses-edit')
  edit(@Param() params) {
    const mockResponse: MockResponse = this.mockResp.find(params.id);
    return { mockResponse };
  }

  @Get('new')
  @Render('mock-responses-edit')
  new(@Param() params) {
    return { 
      mockResponse: {
        name: '',
        active: false,
        req_url: '',
        req_method: 'POST',
        req_payload: '',
        res_status: 200,
        res_delay_sec: 0,
        res_content_type: 'application/json',
        res_body: ''
      } 
    };
  }

  @Get()
  findAll(@Query('q') key): string {
    return this.mockResp.findAll(key);
  }

  @Get(':id')
  findOne(@Param() params): string {
    return this.mockResp.find(params.id);
  }

  @Post()
  create(@Body() data: MockResponse, @Res() res) {
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
