import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({providedIn: 'root'})
export class MockResponsesService {

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  getMockResponses(options) {
    const url = `/mock-responses?q=${options.key||''}&ids=${options.ids||''}`;
    return this.http.get(url);
  }

  getMockResponse(id) {
    return this.http.get(`/mock-responses/` + id);
  }

  updateMockResponse(mockResponse) {
    return this.http.put(`/mock-responses/` + mockResponse.id, mockResponse);
  }

  createMockResponse(mockResponse) {
    return this.http.post(`/mock-responses`, mockResponse);
  }

  deleteMockResponse(id) {
    return this.http.delete(`/mock-responses/` + id);
  }

  activateMockResponse(id) {
    return this.http.put(`/mock-responses/${id}/activate`, {});
  }

  deactivateMockResponse(id) {
    return this.http.put(`/mock-responses/${id}/deactivate`, {});
  }

}
