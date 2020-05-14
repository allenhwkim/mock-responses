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

  play(mockResp) {
    const req = {
      url: mockResp.req_url,
      method: mockResp.req_method || 'POST',
      body: mockResp.req_method !== 'GET' && mockResp.req_payload ? `{
          ${mockResp.req_payload.trim().split(',').map(el => `"${el.trim()}":""`).join(",")}
        }` : undefined
    };

    const httpCall = req.method === 'POST' || req.method === 'PUT'?
      this.http[req.method.toLowerCase()](req.url, req.body) :
      this.http[req.method.toLowerCase()](req.url);

    httpCall.subscribe(
      resp => {
        console.log('[mock-response]', req.url, req.method, resp.body, resp);
        this.snackBar.open(
          `${req.url} ${req.method} call is made. Check console`, 'X', { duration: 3000 }
        );
      }, 
      error => {
        console.error('[mock-response]', req.url, req.method, error);
        this.snackBar.open(
          `Error in ${req.url} ${req.method} call. Check console`, 'X', { duration: 3000 }
        );
      }
    );
  }
}
