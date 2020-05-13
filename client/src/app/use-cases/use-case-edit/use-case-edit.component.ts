import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faEdit, faTrashAlt, faPlusCircle, faBan, faSearch } from '@fortawesome/free-solid-svg-icons';

import { AuthorizedServiceService } from '../../authorized.service';
import { MockResponse } from 'src/app/models/mock-response.interface';
import { UseCase } from 'src/app/models/use-case.interface';
import { MockResponsesService } from 'src/app/mock-responses/mock-responses.service';
import { UseCasesService } from '../use-cases.service';
import { UseCaseDialogComponent } from 'src/app/dialogs/use-case-dialog.component';
import { MockResponseDialogComponent } from 'src/app/dialogs/mock-response-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-use-case-edit',
  templateUrl: './use-case-edit.component.html',
  styleUrls: ['./use-case-edit.component.scss']
})
export class UseCaseEditComponent implements OnInit {
  collectionMode: boolean;
  orgUseCase: UseCase = {};
 
  useCase: UseCase = {};
  faSearch = faSearch; faBan = faBan; faEdit = faEdit;
  faPlusCircle = faPlusCircle; faTrashAlt = faTrashAlt;

  useCases: any;
  mockResponses: any;

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
          this.orgUseCase = {};
          this.useCase = resp;
          this.useCase.id = undefined;
          this.useCases = [...resp.useCases];
          this.mockResponses = [...resp.mockResponses];
        });
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
  
    console.log('.........', {updated});
    return updated;
  }

  updateUseCase() {
    const updated = this.getUpdatedUseCase();
    this.useCaseService.updateUseCase(updated)
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

  openUseCasesDialog() {
    const dialogRef = this.dialog.open(
      UseCaseDialogComponent, {
        width: '90%',
        height: '90%', 
        data: { collectionMode: true, except: [...this.useCases, this.useCase] }
      });
    dialogRef.componentInstance.selectClicked.subscribe(event => {
      this.setUseCases('add', event.id); this.dialog.closeAll();
    });
  }

  openMockResponsesDialog() {
    const dialogRef = this.dialog.open(
      MockResponseDialogComponent, {
        width: '90%',
        height: '90%', 
        data: { collectionMode: true, except: this.mockResponses }
      });
    dialogRef.componentInstance.selectClicked.subscribe(event => {
      this.setMockResponses('add', event.id); this.dialog.closeAll();
    });
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
}
