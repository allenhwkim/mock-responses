import {
  Body, Controller, Delete, Get, Header,
  HttpException, HttpStatus, Param, Post,
  Put, Query, Render, Redirect, Request, Res,
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

  @Get(':id/edit')
  @Render('use-cases-edit')
  edit(@Param() params) {
    const useCase: UseCase = this.useCase.find(params.id);
    const ids = useCase.mock_responses.split(',').map(id => parseInt(id));
    const mockResponses = this.mockResp.findAllBy({ids});
    return { useCase, mockResponses };
  }

  @Get('new')
  @Render('use-cases-edit')
  new(@Param() params) {
    const useCase: UseCase = {id: undefined, name: '', description: '', mock_responses: ''};
    const mockResponses = [];
    return { useCase, mockResponses };
  }

  @Get()
  findAllBy(@Query('q') key): string {
    const by = key && {key};
    return this.useCase.findAllBy(by);
  }

  @Get(':id')
  findOne(@Param() params): string {
    return this.useCase.find(params.id);
  }

  @Post()
  create(@Body() data: UseCase) {
    return this.useCase.create(data);
  }

  @Put(':id/activate')
  activate(@Param() params) {
    return this.useCase.activate(params.id);
  }

  @Put(':id')
  update(@Body() data: UseCase) {
    return this.useCase.update(data);
  }

  @Delete(':id')
  delete(@Param() params) {
    return this.useCase.delete(params.id);
  }
}
