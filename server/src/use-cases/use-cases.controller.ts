import {
  Body, Controller, Delete, Get, Request, Param, Post, Put, Query, Render, Response
} from '@nestjs/common';
import { UseCasesService } from './use-cases.service';
import { MockResponsesService } from '../mock-responses/mock-responses.service';
import { UseCase } from '../common/interfaces/use-case.interface';
import { UseCaseCache } from '../common/use-case-cache';
import { CookieService } from '../common/cookie-service';

@Controller('use-cases')
export class UseCasesController {

  constructor(
    private useCase: UseCasesService,
    private mockResp: MockResponsesService
  ) {
    // set UseCaseCache.data[0] with all first mock_responses url/method
    UseCaseCache.setDefault(); 
  }

  @Get()
  findAllBy(
    @Query('q') key,
    @Query('ids') ids, 
    @Query('except') except, 
    @Query('activeOnly') activeOnly, 
    @Request() req
  ) {
    if (activeOnly) {
      const avail = UseCaseCache.getAvailableMockResponses(req);
      // avail.availableMockResponses only has ids, x.setMockResponses replace id to the object
      UseCaseCache.replaceMockResponseIdToMockResponse(avail.availableMockResponses);
      return {
        activeUseCases: avail.activeUseCases, // based on UCIDS cookie
        activeMockResponses: avail.activeMockResponses, // based on MRIDS cookie
        availableMockResponses: avail.availableMockResponses, // based on MRIDS, deep-cloned
        mockResponseIds: avail.mockResponseIds
      }
    } else {
      const useCases = this.useCase.findAllBy({key, ids, except})
      return { useCases };
    }
  }

  @Get('cached')
  geCached() {
    return UseCaseCache.data;
  }

  @Get('last')
  findLast(@Param() params) {
    const useCase: UseCase = this.useCase.findLast();
    return useCase;
  }

  @Get(':id')
  findOne(@Param() params) {
    const useCase: UseCase = this.useCase.find(params.id);
    return useCase;
  }

  @Put(':id/activate')
  activate(@Param() params, @Response() res, @Request() req) {
    const activeUseCases = (CookieService.getCookie(req, 'UCIDS') || '')
      .split(',').filter(el => el).map(el => +el);
    const useCase: UseCase = this.useCase.find(+params.id);
    if (useCase) {
      const newActiveUseCases = [...activeUseCases, useCase.id];
      CookieService.setCookie(req, res, 'UCIDS', newActiveUseCases.join(','));
      res.send(newActiveUseCases);
    } else {
      res.send(activeUseCases);
    }
  }

  @Put(':id/deactivate')
  deactivate(@Param() params, @Response() res, @Request() req) {
    const activeUseCases = (CookieService.getCookie(req, 'UCIDS') || '')
      .split(',').filter(el => el).map(el => +el);
    const useCase: UseCase = this.useCase.find(+params.id);
    if (useCase) {
      const newActiveUseCases = activeUseCases.filter(el => +el !== +params.id);
      CookieService.setCookie(req, res, 'UCIDS', newActiveUseCases.join(','));
      res.send(newActiveUseCases);
    } else {
      res.send(activeUseCases);
    }
  }

  @Post()
  create(@Body() data: UseCase) {
    return this.useCase.create(data);
  }

  @Put(':id')
  update(@Param() params, @Body() data: UseCase) {
    return this.useCase.update(params.id, data);
  }

  @Delete(':id')
  delete(@Param() params) {
    return this.useCase.delete(params.id);
  }
}
