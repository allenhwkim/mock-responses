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

  @Get('index')
  @Render('use-cases-list')
  index(@Query('q') key) {    
    const grouped = this.findAllBy(key);
    return { grouped };
  }

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
  new(@Query('from') from) {
    const row = from ? this.useCase.find(from) : {};
    const mockResponses = [];
    return { 
      useCase: {
        id: undefined, 
        name: row.name || '', 
        description: row.description || '',
        category: row.category || '',
        mock_responses: row.mock_responses || ''
      }, 
      mockResponses
    };
  }

  @Get()
  findAllBy(@Query('q') key) {
    const mockResponses = {};

    const apiGrouped = this.useCase.findAllBy({ apiGroup: 1, key });

    if (key == undefined || key.trim() == "") {
      apiGrouped.forEach(({category, count}) => {
        const data = this.useCase.findAllBy({category: category});
        const id = data[0].id;
        mockResponses[category] = { id, count, data };
      });
    } else {
      mockResponses['Search Results'] = {
        'id': 0,
        'count': apiGrouped.length,
        'data': apiGrouped
      }
    }

    return mockResponses;
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
