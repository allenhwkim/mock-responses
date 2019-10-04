import { UseCasesService } from './use-cases.service';
import { MockResponsesService } from '../mock-responses/mock-responses.service';
import { UseCase } from '../common/interfaces/use-case.interface';
export declare class UseCasesController {
    private useCase;
    private mockResp;
    constructor(useCase: UseCasesService, mockResp: MockResponsesService);
    edit(params: any): {
        useCase: UseCase;
        mockResponses: any;
    };
    new(params: any): {
        useCase: UseCase;
        mockResponses: any[];
    };
    findAll(key: any): string;
    findOne(params: any): string;
    create(data: UseCase): void;
    activate(params: any): void;
    update(data: UseCase): void;
    delete(params: any): void;
}
