import { APP_INTERCEPTOR } from '@nestjs/core';
import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';

import { AppController } from './app.controller';

import { MockResponsesController } from './mock-responses/mock-responses.controller';
import { MockResponsesService } from './mock-responses/mock-responses.service';

import { UseCasesService } from './use-cases/use-cases.service';
import { UseCasesController } from './use-cases/use-cases.controller';
import { UseCaseToMockResponsesService } from './use-cases/use-case-to-mock-resonses.service';
import { UseCaseToUseCasesService } from './use-cases/use-case-to-use-cases.service';

@Module({
  controllers: [
    AppController,
    MockResponsesController,
    UseCasesController,
  ],
  providers: [
    MockResponsesService,
    UseCasesService,
    UseCaseToMockResponsesService,
    UseCaseToUseCasesService
  ],
})
export class AppModule {}
