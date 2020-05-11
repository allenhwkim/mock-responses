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
    @Request() req
  ) {
    const activeUseCase = this.useCase.cookies(req, 'UCID');
    const useCases = this.useCase.findAllBy({key, ids, except})
    useCases.forEach(el => {
      const mockRespIds = el.mock_responses.split(',').filter(el=>el).map(id => parseInt(id));
      el.mockResponses = this.mockResp.findAllBy({ids: mockRespIds});
      const useCaseIds = (el.use_cases||'').split(',').filter(el=>el).map(id => parseInt(id));
      el.useCases = this.useCase.findAllBy({ids: useCaseIds});
      el.active = el.id === +activeUseCase;
    });

    return { useCases, activeUseCase };
  }

  @Get(':id')
  findOne(@Param() params) {
    const useCase: UseCase = this.useCase.find(params.id);
    const mockResponseIds = useCase.mock_responses.split(',').map(id => parseInt(id));
    const mockResponses = this.mockResp.findAllBy({ids: mockResponseIds});
    const useCaseIds = useCase.use_cases.split(',').map(id => parseInt(id));
    const useCases = this.useCase.findAllBy({ids: useCaseIds});
    return {useCase, mockResponses, useCases};
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
