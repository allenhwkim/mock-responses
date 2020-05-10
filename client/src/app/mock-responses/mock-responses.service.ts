import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class MockResponsesService {

  constructor(private http: HttpClient) {}

  getMockRespones(options) {
    const url = `/mock-responses?q=${options.key}&active=${options.active}&ids=${options.ids}`;
    return this.http.get(url);
  }

}
