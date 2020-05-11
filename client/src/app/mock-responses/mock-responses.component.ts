import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';

import { MockResponsesService } from './mock-responses.service';
import { AuthorizedServiceService } from '../authorized.service';
import { MockResponseSelectDialogComponent } from '../dialogs/mock-response-select-dialog.component';
import { UseCaseSelectDialogComponent } from '../dialogs/use-case-select-dialog.component copy';

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
    private snackBar: MatSnackBar,
    public auth: AuthorizedServiceService,
    private http: HttpClient,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.searchTermChanged('');
  }

  searchTermChanged(event) {
    const key = (event && event.target.value) || '';
    this.mockResponseService.getMockResponses({key})
      .subscribe( (resp:any) => {
        this.mockResponses = resp.mockResponses;
        this.activeUseCase = resp.activeUseCase;
        this.useCases = resp.useCases;
      })
  }

  openSearchUseCasesDialog() {
    const dialogRef = this.dialog.open(
      UseCaseSelectDialogComponent, 
      {width: '90%', height: '90%'}
    );
    dialogRef.afterClosed().subscribe(result => {});
  }

  activateUseCaseClicked(event) {
    console.log('activateUseCase', event);
  }

}
