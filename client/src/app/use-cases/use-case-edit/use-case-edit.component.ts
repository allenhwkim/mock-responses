import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faEdit, faTrashAlt, faPlusCircle, faBan, faSearch } from '@fortawesome/free-solid-svg-icons';

import { AuthorizedServiceService } from '../../authorized.service';
import { MockResponse } from 'src/app/models/mock-response.interface';
import { UseCase } from 'src/app/models/use-case.interface';
import { MockResponsesService } from 'src/app/mock-responses/mock-responses.service';
import { UseCasesService } from '../use-cases.service';
import { MatDialog } from '@angular/material/dialog';
import { UseCaseDialogComponent } from 'src/app/dialogs/use-case-dialog.component';
import { MockResponseDialogComponent } from 'src/app/dialogs/mock-response-dialog.component';

@Component({
  selector: 'app-use-case-edit',
  templateUrl: './use-case-edit.component.html',
  styleUrls: ['./use-case-edit.component.scss']
})
export class UseCaseEditComponent implements OnInit {
  collectionMode: boolean;

  useCase: UseCase = {useCases: [], mockResponses: []};
  orgUseCase: UseCase = {useCases: [], mockResponses: []};
 
  faSearch = faSearch; faBan = faBan; faEdit = faEdit;
  faPlusCircle = faPlusCircle; faTrashAlt = faTrashAlt;

  useCases = [];
  mockResponses = [];

  searchUseCases = [];
  useCaseSearchVisible = false;
  searchMockResponses = [];
  mockResponseSearchVisible = false;

  constructor(
    public auth: AuthorizedServiceService,
    public mockResponseService: MockResponsesService,
    private useCaseService: UseCasesService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const from = this.route.snapshot.queryParamMap.get('from');
    if (id) {
      this.useCaseService.getUseCase(id)
        .subscribe((resp:any) => {
          this.orgUseCase = resp;
          this.useCase = {...this.orgUseCase};
          this.useCases = [...resp.useCases];
          this.mockResponses = [...resp.mockResponses];
        });
    } else if (from) {
      this.useCaseService.getUseCase(from)
        .subscribe((resp:any) => {
          this.orgUseCase = {useCases: [], mockResponses: []};
          this.useCase = resp;
          this.useCase.id = undefined;
          this.useCases = [...resp.useCases];
          this.mockResponses = [...resp.mockResponses];
        });
    } else if (!id) {
      // this.useCaseService.getUseCases({ids: 1}) // the default use case
      //   .subscribe((resp:any) => this.useCases = [...resp.useCases] );
    }
  }

  getUpdatedUseCase() {
    const updated: any = {id: this.useCase.id};
    for(var key in this.useCase) {
      if (this.orgUseCase[key] !== this.useCase[key]) {
        updated[key] = this.useCase[key];
      }
    }
    const orgUseCaseIds = this.orgUseCase.useCases.map(el => el.id);
    const newUseCaseIds = this.useCases.map(el => el.id);
    (''+orgUseCaseIds !== ''+newUseCaseIds) && (updated.useCaseIds = newUseCaseIds);

    const orgMockRespIds = this.orgUseCase.mockResponses.map(el => el.id);
    const newMockRespIds = this.mockResponses.map(el => el.id);
    (''+orgMockRespIds !== ''+newMockRespIds) && (updated.mockResponseIds = newMockRespIds);
  
    return updated;
  }

  updateUseCase() {
    const updated = this.getUpdatedUseCase();
    this.useCaseService.updateUseCase(this.orgUseCase.id, updated)
      .subscribe(resp => this.router.navigate(['/use-cases']) );
  }

  createUseCase() {
    const updated = this.getUpdatedUseCase();
    this.useCaseService.createUseCase(updated)
      .subscribe(resp => this.router.navigate(['/use-cases']) );
  }

  deleteUseCase(event?) {
    this.useCaseService.deleteUseCase(this.useCase.id)
      .subscribe(resp => this.router.navigate(['/use-cases']) );
  }

  openUseCasesSearch(by = {key: ''}) {
    const except = [...this.useCases, this.useCase];
    this.useCaseService.getUseCases(by)
      .subscribe( (resp: any) => {
        const excludeIds = except.map(el => el.id);
        this.searchUseCases = resp.useCases.filter(el => !excludeIds.includes(el.id));
        this.useCaseSearchVisible = true;
    })
  }

  showMockResponsesSearch(by = {key: ''}) {
    this.mockResponseService.getMockResponses(by)
      .subscribe( (resp: any) => {
        const excludeIds = this.mockResponses.map(el => el.id);
        this.searchMockResponses = resp.mockResponses.filter(el => !excludeIds.includes(el.id));
        this.mockResponseSearchVisible= true;
    })
  }

  setUseCases(action, useCaseId) {
    const allUCIds = this.useCases.map(el => el.id);
    const useCaseIds = 
      action === 'add' ? allUCIds.concat(useCaseId).join(',') :
      action === 'remove' ? allUCIds.filter(el => el !== useCaseId).join(',') : '';
    this.useCaseService.getUseCases({ids: useCaseIds || '0  '})
      .subscribe( (resp: any) => this.useCases = resp.useCases);
  }

  setMockResponses(action, mockRespId) {
    const allMockRespIds = this.mockResponses.map(el => el.id);
    const mockRespIds = 
      action === 'add' ? allMockRespIds.concat(mockRespId).join(',') :
      action === 'remove' ? allMockRespIds.filter(el => el !== mockRespId).join(',') : '';
    this.mockResponseService.getMockResponses({ids: mockRespIds || '0'})
      .subscribe( (resp: any) => this.mockResponses = resp.mockResponses);
  }

  openUseCaseDialog(useCase) {
    const dialogRef = this.dialog.open(UseCaseDialogComponent, { data: { useCase } });
  }

  openMockResponseDialog(mockResponse) {
    const dialogRef = this.dialog.open(MockResponseDialogComponent, { data: { mockResponse } });
  }

}
