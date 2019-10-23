import {
  Body, Controller, Delete, Get,
  Param, Post, Put, Query, Render,
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

  // Render the list of all use cases in sidebar
  @Get('index')
  @Render('use-cases-list')
  index(@Query('q') key) {
    const grouped = this.findAllBy(key);
    return { grouped };
  }

  // Render the Edit Page
  @Get(':id/edit')
  @Render('use-cases-edit')
  edit(@Param() params) {
    const useCase: UseCase = this.useCase.find(params.id);
    const ids = useCase.mock_responses.split(',').map(id => parseInt(id));
    const mockResponses = this.mockResp.findAllBy({ids});
    return { useCase, mockResponses };
  }

  // Render the New Page or Duplicate Page based on data provided.
  @Get('new')
  @Render('use-cases-edit')
  new(@Query('from') from) {
    var useCase = {
      id: undefined,
      name: '',
      description: '',
      mock_responses: '',
      category: ''
    };
    var mockResponses = [];
  
    // for duplicating an existing use case
    if (from) {
      const row = this.useCase.find(from);
      const ids = row.mock_responses.split(',').map(id => parseInt(id));
      mockResponses = this.mockResp.findAllBy({ids});

      useCase.name = row.name;
      useCase.description = row.description;
      useCase.mock_responses = row.mock_responses;
      useCase.category = row.category;
      return { useCase, mockResponses }
    } else {
      return { useCase, mockResponses }

    }
  }

  // Return all use cases or search by query
  @Get()
  findAllBy(@Query('q') key) {
    const mockResponses = {};

    // Gets a json object of all use cases, grouped into their category
    const apiGrouped = this.useCase.findAllBy({ apiGroup: 1 });

    if (key == undefined || key.trim() == "") {
      apiGrouped.forEach(({ category, count }) => {
        const data = this.useCase.findAllBy({ category: category });
        const id = data[0].id;
        mockResponses[category] = { id, count, data };
      });
    } else {
      apiGrouped.forEach(({ category, count }) => {
        const data = this.useCase.findAllBy({ 
          key: key, 
          category: category
        });
        if (data.length > 0) {
          const id = data[0].id;
          count = data.length;
          mockResponses[category] = { id, count, data };
        }
      });
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
