import { APP_INTERCEPTOR } from '@nestjs/core';
import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';

import { AppController } from './app.controller';

import { MockResponsesController } from './mock-responses/mock-responses.controller';
import { MockResponsesService } from './mock-responses/mock-responses.service';

import { UseCasesService } from './use-cases/use-cases.service';
import { UseCasesController } from './use-cases/use-cases.controller';

@Module({
  controllers: [
    AppController,
    MockResponsesController,
    UseCasesController,
  ],
  providers: [
    MockResponsesService,
    UseCasesService,
  ],
})
export class AppModule {}
