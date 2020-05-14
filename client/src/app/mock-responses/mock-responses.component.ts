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
  mockResponses: any;
  faPlus = faPlus; faSearch = faSearch;

  constructor(
    public mockResponseService: MockResponsesService,
    private useCaseService: UseCasesService,
    public auth: AuthorizedServiceService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.setMockResponses({key:''});
  }

  setMockResponses(by) {
    this.mockResponseService.getMockResponses(by)
      .subscribe( (resp:any) => {
        this.mockResponses = resp.mockResponses;
      })
  }

  deleteClicked(event) {
    this.mockResponseService.deleteMockResponse(event.id)
      .subscribe( (resp: any) => this.setMockResponses({key:''}) );
  }

}
