import {
  Body, Controller, Delete, Get, Header,
  HttpException, HttpStatus, Param, Post,
  Put, Query, Redirect, Render, Request, Res,
} from '@nestjs/common';
import { MockResponsesService } from './mock-responses.service';
import { MockResponse } from '../common/interfaces/mock-response.interface';

@Controller('mock-responses')
export class MockResponsesController {

  constructor(private mockResp: MockResponsesService) {
  }

  @Get('index')
  @Render('mock-responses/index')
  index(@Query('q') key) {
    const mockResponses = this.mockResp.findAll(key);
    return { mockResponses };
  }

  @Post()
  create(@Body() data: MockResponse, @Res() res) {
    return this.mockResp.create(data) ? 'created' : 'error';
  }

  @Get()
  findAll(@Query('q') key): string {
    return this.mockResp.findAll(key);
  }

  @Get(':id')
  findOne(@Param() params): string {
    return this.mockResp.find(params.id);
  }

  @Put(':id')
  update(@Body() data: MockResponse): string {
    return this.mockResp.update(data) ? 'success' : 'error';
  }

  @Put(':id/activate')
  activate(@Param() params): string {
    return this.mockResp.activate(params.id) ? 'success' : 'error';
  }

  @Delete(':id')
  delete(@Param() params): string {
    return this.mockResp.delete(params.id) ? 'success' : 'error';
  }
}
