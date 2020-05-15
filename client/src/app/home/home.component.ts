import { Component, OnInit } from '@angular/core';
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { flatMap } from 'rxjs/operators';

import { MockResponsesService } from '../mock-responses/mock-responses.service';
import { AuthorizedServiceService } from '../authorized.service';
import { UseCaseDialogComponent } from '../dialogs/use-case-dialog.component';
import { UseCasesService } from '../use-cases/use-cases.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  activeUseCases = [];
  activeUseCaseIds = [];
  mockResponses: any;
  faPlus = faPlus; faSearch = faSearch;

  constructor(
    public mockResponseService: MockResponsesService,
    private useCaseService: UseCasesService,
    public auth: AuthorizedServiceService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.setUseCases({activeOnly: 1});
  }

  setUseCases(by) {
    this.useCaseService.getUseCases(by)
      .subscribe( (resp:any) => {
        this.activeUseCases = resp.useCases;
      });
  }

  setMockResponses(by) {
    alert('TODO');
  }

  openUseCasesDialog() {
    const dialogRef = this.dialog.open(
      UseCaseDialogComponent, {
        width: '90%',
        height: '90%', 
        data: { collectionMode: true, except: this.activeUseCases}
      });
    dialogRef.componentInstance.selectClicked.subscribe(event => {
      this.useCaseService.activateUseCase(event.id).subscribe( (resp:any) => {
        this.activeUseCaseIds = resp;
        this.useCaseService.getUseCases({activeOnly: 1}).subscribe((resp: any) => {
          this.activeUseCases = resp.useCases;
          this.mockResponses = resp.mockResponses;
          this.dialog.closeAll();
        });
      });
    })
  }

  deactivateUseCase(useCase) {
    console.log('deleteClicked', useCase);
    this.useCaseService.deactivateUseCase(useCase.id).subscribe( (resp:any) => {
      this.activeUseCaseIds = resp;
      this.useCaseService.getUseCases({activeOnly: 1}).subscribe((resp: any) => {
        this.activeUseCases = resp.useCases;
        this.mockResponses = resp.mockResponses;
      });
    });
  }

}
