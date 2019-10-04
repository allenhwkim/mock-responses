import { MockResponse } from '../common/interfaces/mock-response.interface';
export declare class MockResponsesService {
    db: any;
    constructor();
    create(data: MockResponse): void;
    find(id: number): any;
    findAll(key?: any): any;
    findBy(by: any): any;
    findByIds(ids: Array<number>): any;
    update(data: any): void;
    activate(id: any): void;
    delete(id: any): void;
}
