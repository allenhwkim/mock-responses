import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MockResponsesService } from '../mock-responses/mock-responses.service';
import { AuthorizedServiceService } from '../authorized.service';
import { UseCaseDialogComponent } from '../dialogs/use-case-dialog.component';
import { UseCasesService } from '../use-cases/use-cases.service';
import { MockResponseDialogComponent } from '../dialogs/mock-response-dialog.component';
import { MockResponse } from '../models/mock-response.interface';
import { UseCase } from '../models/use-case.interface';

@Component({
  selector: 'app-actives',
  templateUrl: './actives.component.html',
  styleUrls: ['./actives.component.scss']
})
export class ActivesComponent implements OnInit {
  objectEntries = Object.entries;

  activeUseCases = [];
  activeMockResponses = [];
  availableMockResponses: any= [];

  searchUseCases = [];
  useCaseSearchVisible = false;
  searchMockResponses = [];
  mockResponseSearchVisible = false;
  availMockRespSearch: string;
  tab = 'mock-responses';

  error;

  constructor(
    public mockResponseService: MockResponsesService,
    private useCaseService: UseCasesService,
    public auth: AuthorizedServiceService,
    public route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this._setProperties().then(resp => {
      this.availMockRespSearch = this.route.snapshot.queryParamMap.get('search');
    });
  }

  setMockResponses(by = {key: ''}) {
    // filter available mock responses
    this.router.navigate([], { 
      relativeTo: this.route,
      queryParams: { search: by.key },
      queryParamsHandling: 'merge'
    });
  }

  openUseCaseDialog(useCase) {
    const dialogRef = this.dialog.open(UseCaseDialogComponent, { data: { useCase } });
  }

  openMockResponseDialog(mockResponse) {
    const dialogRef = this.dialog.open(MockResponseDialogComponent, { data: { mockResponse } });
    this.play(mockResponse);
  }

  showUseCasesSearch(by = {key: ''}) {
    this.useCaseService.getUseCases(by)
      .subscribe( (resp: any) => {
        const activeUseCaseIds = this.activeUseCases.map(el => el.id);
        this.searchUseCases = resp.useCases.filter(el => !activeUseCaseIds.includes(el.id));
        this.useCaseSearchVisible = true;
    })
  }
 
  showMockResponsesSearch(by = {key: ''}) {
    this.mockResponseService.getMockResponses(by)
      .subscribe( (resp: any) => {
        const activeMockResponseIds = this.activeMockResponses.map(el => el.id);
        this.searchMockResponses = resp.mockResponses.filter(el => !activeMockResponseIds.includes(el.id));
        this.mockResponseSearchVisible = true;
    })
  }

  activateUseCase(useCase: UseCase) {
    this.useCaseService.activateUseCase(useCase.id).toPromise()
      .then(resp => this._setProperties());
  }

  deactivateUseCase(useCase: UseCase) {
    this.useCaseService.deactivateUseCase(useCase.id).toPromise()
      .then(resp => this._setProperties());
  }

  activateMockResponse(mockResponse: MockResponse) {
    this.mockResponseService.activateMockResponse(mockResponse.id).toPromise()
      .then(resp => this._setProperties());
  }

  deactivateMockResponse(mockResponse: MockResponse) {
    this.mockResponseService.deactivateMockResponse(mockResponse.id).toPromise()
      .then(resp => this._setProperties());
  }

  _setProperties() {
    return this.useCaseService.getUseCases({activeOnly: 1}).toPromise()
      .then( (resp:any) => {
        this.activeUseCases = resp.activeUseCases;
        this.activeMockResponses = resp.activeMockResponses;
        this.availableMockResponses = resp.availableMockResponses;
      })
      .catch(e => this.error = e.message);
  }

  foundMockResp(mockResp: MockResponse, key: string) {
    return !key ||
      mockResp.req_url.includes(key) || 
      (mockResp.name || '').includes(key) || 
      (mockResp.res_body || '').includes(key);
  }
 
  play(mockResp: MockResponse) {
    const req = {
      url: mockResp.req_url,
      method: mockResp.req_method || 'GET',
      body: mockResp.req_method !== 'GET' && mockResp.req_payload ? 
        mockResp.req_payload.split(',').reduce( (acc, el) => {
          acc[el.trim()] = '1';
          return acc;
        }, {}) : undefined
    };

    const options = {responseType: mockResp.res_content_type};
    const httpCall = req.method === 'POST' || req.method === 'PUT'?
      this.http[req.method.toLowerCase()](req.url, req.body, options) :
      this.http[req.method.toLowerCase()](req.url, options);

    httpCall.subscribe(
      resp => {
        console.log('[mock-response]', req.url, req.method, resp.body, resp);
        this.snackBar.open(
          `${req.url} ${req.method} call is made. Check console`, 'X', { duration: 3000 }
        );
      }, 
      error => {
        console.error(error.message);
        console.error('[mock-response]', req.url, req.method, error);
        this.snackBar.open(
          `Error in ${req.url} ${req.method} call. Check console`, 'X', { duration: 3000 }
        );
      }
    );
  }
}
