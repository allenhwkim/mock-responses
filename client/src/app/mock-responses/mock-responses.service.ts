import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class MockResponsesService {

  constructor(private http: HttpClient) {}

  getMockResponses(options) {
    const url = `/mock-responses?` + 
      `q=${options.key||''}&active=${options.active||''}&ids=${options.ids||''}`;
    return this.http.get(url);
  }

  getMockResponse(id) {
    return this.http.get(`/mock-responses/` + id);
  }

  updateMockResponse(mockResponse) {
    return this.http.put(`/mock-responses/` + mockResponse.id, mockResponse);
  }

  createMockResponse(mockResponse) {
    return this.http.put(`/mock-responses`, mockResponse);
  }

  deleteMockResponse(id) {
    return this.http.delete(`/mock-responses` + id);
  }
}
