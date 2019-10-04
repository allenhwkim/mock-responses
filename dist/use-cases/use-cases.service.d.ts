import { UseCase } from '../common/interfaces';
import { MockResponsesService } from '../mock-responses/mock-responses.service';
export declare class UseCasesService {
    private mockResp;
    db: any;
    constructor(mockResp: MockResponsesService);
    create(data: UseCase): void;
    find(id: number): any;
    findAll(key?: any): any;
    update(data: UseCase): void;
    delete(id: any): void;
    activate(id: any): void;
}
