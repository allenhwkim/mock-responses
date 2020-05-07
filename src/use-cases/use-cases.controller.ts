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

  // Render the list of all use cases in sidebar
  @Get('index')
  @Render('use-cases-list')
  index(
    @Query('q') key,
    @Query('ids') ids, 
    @Query('except') except, 
    @Request() req
  ) {
    const activeUseCase = this.useCase.cookies(req, 'UCID');
    const useCases = this.useCase.findAllBy({key, ids, except})
    useCases.forEach(el => {
      const ids = el.mock_responses.split(',').map(id => parseInt(id));
      el.mockResponses = this.mockResp.findAllBy({ids});
      el.active = el.id === +activeUseCase;
    });

    return { useCases, activeUseCase };
  }

  // Render the Edit Page
  @Get(':id/edit')
  @Render('use-cases-edit')
  edit(@Param() params, @Response() res) {
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
      mock_responses: ''
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
      return { useCase, mockResponses }
    } else {
      return { useCase, mockResponses }
    }
  }

  @Get(':id')
  findOne(@Param() params): string {
    return this.useCase.find(params.id);
  }

  @Put(':id/activate')
  activate(@Param() params, @Response() res, @Request() req) {
    const useCase: UseCase = this.useCase.find(+params.id);
    const matches = req.hostname.match(/[-\w]+\.(?:[-\w]+\.xn--[-\w]+|[-\w]{3,}|[-\w]+\.[-\w]{2})$/i);
    const topLevelDomain = (matches && matches[0]) || req.hostname;
    const cookieDomain = topLevelDomain.match(/\./) ? '.' + topLevelDomain : topLevelDomain;
    if (useCase) {
      res.cookie('UCID', useCase.id, {
        path: '/',
        domain: cookieDomain,
        maxAge: 604800 
      });
    }  
    res.end();
  }


  @Post()
  create(@Body() data: UseCase) {
    return this.useCase.create(data);
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
