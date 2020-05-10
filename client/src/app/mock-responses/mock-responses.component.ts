import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { HttpClient } from '@angular/common/http';

import { MockResponsesService } from './mock-responses.service';
import { AuthorizedServiceService } from '../authorized.service';

@Component({
  selector: 'app-mock-responses',
  templateUrl: './mock-responses.component.html',
  styleUrls: ['./mock-responses.component.scss']
})
export class MockResponsesComponent implements OnInit {
  useCases: any;
  activeUseCase: any;
  mockResponses: any;
  faPlus = faPlus; faSearch = faSearch;

  constructor(
    private mockResp: MockResponsesService,
    private snackBar: MatSnackBar,
    public auth: AuthorizedServiceService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.searchTermChanged('');
  }

  searchTermChanged(event) {
    const key = (event && event.target.value) || '';
    this.mockResp.getMockResponses({key})
      .subscribe( (resp:any) => {
        this.mockResponses = resp.mockResponses;
        this.activeUseCase = resp.activeUseCase;
        this.useCases = resp.useCases;
      })
  }

  openSearchUseCasesDialog() {
    console.log('openSearchUseCaseDialog');
  }

  activateUseCaseClicked(event) {
    console.log('activateUseCase', event);
  }

  playClicked(mockResp) {
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
