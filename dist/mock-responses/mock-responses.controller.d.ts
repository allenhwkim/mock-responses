import { MockResponsesService } from './mock-responses.service';
import { MockResponse } from '../common/interfaces';
export declare class MockResponsesController {
    private mockResp;
    constructor(mockResp: MockResponsesService);
    index(key: any): {
        mockResponses: any;
    };
    edit(params: any): {
        mockResponse: MockResponse;
    };
    new(params: any): {
        mockResponse: {
            name: string;
            active: boolean;
            req_url: string;
            req_method: string;
            req_payload: string;
            res_status: number;
            res_delay_sec: number;
            res_content_type: string;
            res_body: string;
        };
    };
    findAll(key: any): string;
    findOne(params: any): string;
    create(data: MockResponse): void;
    update(data: MockResponse): void;
    activate(params: any): void;
    delete(params: any): void;
}
