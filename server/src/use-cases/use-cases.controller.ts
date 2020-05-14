import {
  Body, Controller, Delete, Get, Request, Param, Post, Put, Query, Render, Response
} from '@nestjs/common';
import { UseCasesService } from './use-cases.service';
import { MockResponsesService } from '../mock-responses/mock-responses.service';
import { UseCase } from '../common/interfaces/use-case.interface';

@Controller('use-cases')
export class UseCasesController {

  constructor(
    private useCase: UseCasesService,
    private mockResp: MockResponsesService
  ) {}

  @Get()
  findAllBy(
    @Query('q') key,
    @Query('ids') ids, 
    @Query('except') except, 
    @Query('activeOnly') activeOnly, 
    @Request() req
  ) {
    if (activeOnly) {
      const ucIds = this.useCase.getCookie(req, 'UCIDS') || '0';
      const useCases = this.useCase.findAllBy({ids: ucIds});
      return { useCases };
    } else {
      const useCases = this.useCase.findAllBy({key, ids, except})
      return { useCases };
    }
  }

  @Get(':id')
  findOne(@Param() params) {
    const useCase: UseCase = this.useCase.find(params.id);
    return useCase;
  }

  @Put(':id/activate')
  activate(@Param() params, @Response() res, @Request() req) {
    const activeUseCases = (this.useCase.getCookie(req, 'UCIDS') || '')
      .split(',').filter(el => el).map(el => +el);
    const useCase: UseCase = this.useCase.find(+params.id);
    if (useCase) {
      const newActiveUseCases = [...activeUseCases, useCase.id];
      this.useCase.setCookie(req, res, 'UCIDS', newActiveUseCases.join(','));
      res.send(newActiveUseCases);
    } else {
      res.send(activeUseCases);
    }
  }

  @Put(':id/deactivate')
  deactivate(@Param() params, @Response() res, @Request() req) {
    const activeUseCases = (this.useCase.getCookie(req, 'UCIDS') || '')
      .split(',').filter(el => el).map(el => +el);
    const useCase: UseCase = this.useCase.find(+params.id);
    if (useCase) {
      const newActiveUseCases = activeUseCases.filter(el => +el !== +params.id);
      this.useCase.setCookie(req, res, 'UCIDS', newActiveUseCases.join(','));
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
