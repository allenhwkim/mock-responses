import { Component, OnInit } from '@angular/core';
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';

import { MockResponsesService } from './mock-responses.service';
import { AuthorizedServiceService } from '../authorized.service';
import { UseCaseDialogComponent } from '../dialogs/use-case-dialog.component';
import { UseCasesService } from '../use-cases/use-cases.service';

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
    public mockResponseService: MockResponsesService,
    private useCaseService: UseCasesService,
    public auth: AuthorizedServiceService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.updateMockResponses({key:''});
  }

  updateMockResponses(data) {
    data  = data.target ? {key: data.target.value} : data;
    this.mockResponseService.getMockResponses(data)
      .subscribe( (resp:any) => {
        this.mockResponses = resp.mockResponses;
        this.activeUseCase = resp.activeUseCase;
        this.useCases = resp.useCases;
      })
  }

  openUseCasesDialog() {
    const dialogRef = this.dialog.open(
      UseCaseDialogComponent, { 
        width: '90%', height: '90%',
        data: { collectionMode: false, activate: true, activeUseCase: +this.activeUseCase } });
    // acrivate a use case
    dialogRef.componentInstance.selectClicked.subscribe(event => {
      this.useCaseService.activateUseCase(event.id).subscribe(resp => {
        this.updateMockResponses({useCase: event.id});
        this.dialog.closeAll();
      });
    })
  }

  deleteClicked(event) {
    this.mockResponseService.deleteMockResponse(event.id)
      .subscribe( (resp: any) => this.updateMockResponses({key:''}) );
  }

}
