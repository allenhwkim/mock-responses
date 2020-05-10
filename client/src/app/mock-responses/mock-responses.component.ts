import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MockResponsesService } from './mock-responses.service';

@Component({
  selector: 'app-mock-responses',
  templateUrl: './mock-responses.component.html',
  styleUrls: ['./mock-responses.component.scss']
})
export class MockResponsesComponent implements OnInit {
  useCases: any;
  activeUseCase: any;
  mockResponses: any;

  constructor(
    private mockResp: MockResponsesService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.mockResp.getMockRespones({})
      .subscribe( (resp:any) => {
        this.mockResponses = resp.mockResponses;
        this.activateUseCase = resp.activeUseCase;
        this.useCases = resp.useCases;
      })
  }

  searchTermChanged(event) {
    console.log('search term changed', event);
    this.mockResp.getMockRespones({})
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
      url: mockResp.url,
      method: mockResp.method || 'POST',
      body: mockResp.method !== 'GET' && mockResp.req_payload ? `{
          ${mockResp.req_payload.trim().split(',').map(el => `"${el.trim()}":""`).join(",")}
        }` : undefined;
    };
    window.fetch(req.url, {
        method: req.method,
        body: req.body,
        headers: {
         'Accept': mockResp.res_content_type,
         'Content-Type': 'application/json'
        }
      }).then(resp => {
        console.log('[mock-response]', req.url, req.method, req.body, resp);
        this.snackBar.open(`${req.url} ${req.method} call is made. Check console log`);
      });
  }
}
