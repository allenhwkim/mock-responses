import {
  Body, Controller, Delete, Get, Param, Post, Put, Query, Request,
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

  @Get()
  findAllBy(
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
