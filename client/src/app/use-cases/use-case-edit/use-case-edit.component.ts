import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faEdit, faTrashAlt, faPlusCircle, faBan, faSearch } from '@fortawesome/free-solid-svg-icons';

import { AuthorizedServiceService } from '../../authorized.service';
import { MockResponse } from 'src/app/models/mock-response.interface';
import { UseCase } from 'src/app/models/use-case.interface';
import { MockResponsesService } from 'src/app/mock-responses/mock-responses.service';
import { UseCasesService } from '../use-cases.service';
import { UseCaseSelectDialogComponent } from 'src/app/dialogs/use-case-select-dialog.component copy';
import { MockResponseSelectDialogComponent } from 'src/app/dialogs/mock-response-select-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-use-case-edit',
  templateUrl: './use-case-edit.component.html',
  styleUrls: ['./use-case-edit.component.scss']
})
export class UseCaseEditComponent implements OnInit {
  orgUseCase: UseCase = {};
  useCase: UseCase = {};
  faSearch = faSearch; faBan = faBan; faEdit = faEdit; faPlusCircle = faPlusCircle; faTrashAlt = faTrashAlt;

  constructor(
    public auth: AuthorizedServiceService,
    private mockResponseService: MockResponsesService,
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
        });
    } else if (from) {
      this.useCaseService.getUseCase(from)
        .subscribe((resp:any) => {
          this.orgUseCase = {};
          this.useCase = resp;
          this.useCase.id = undefined;
        });
    }
  }

  getUpdatedUseCase() {
    const updated = {id: this.useCase.id};
    for(var key in this.useCase) {
      if (this.orgUseCase[key] !== this.useCase[key]) {
        updated[key] = this.useCase[key];
      }
    }
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

  deleteMockResponse() {
    this.useCaseService.deleteUseCase(this.useCase.id)
      .subscribe(resp => this.router.navigate(['/use-cases']) );
  }

  openSearchUseCasesDialog() {
    const dialogRef = this.dialog.open(
      UseCaseSelectDialogComponent, 
      {width: '90%', height: '90%'}
    );
    dialogRef.afterClosed().subscribe(result => {});
  }

  openSearchMockResponsesDialog() {
    const dialogRef = this.dialog.open(
      MockResponseSelectDialogComponent, 
      {width: '90%', height: '90%'}
    );
    dialogRef.afterClosed().subscribe(result => {});
  }

}
