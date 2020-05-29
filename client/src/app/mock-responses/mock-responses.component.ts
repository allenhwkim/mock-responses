import { Component, OnInit } from '@angular/core';
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';

import { MockResponsesService } from './mock-responses.service';
import { AuthorizedServiceService } from '../authorized.service';
import { MockResponseDialogComponent } from '../dialogs/mock-response-dialog.component';
import { UseCaseDialogComponent } from '../dialogs/use-case-dialog.component';
import { UseCasesService } from '../use-cases/use-cases.service';

@Component({
  selector: 'app-mock-responses',
  templateUrl: './mock-responses.component.html',
  styleUrls: ['./mock-responses.component.scss']
})
export class MockResponsesComponent implements OnInit {
  useCases: any; // actvieeMockResponses, activeUseCases, mockResponseIds, availableMockRespnses
  mockResponses: any; // mock_resonses table data
  availableIds: Array<number>; // mock response ids from useCases.availableMockResponese
  activeIds: Array<number>; // avail mock responses ids, which is set by activating it
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

  async setMockResponses(by) {
    const mockResps: any = await this.mockResponseService.getMockResponses(by).toPromise();
    const useCases: any = await this.useCaseService.getUseCases({activeOnly:1}).toPromise();
    this.mockResponses = mockResps.mockResponses;
    this.activeIds = useCases.activeMockResponses.map(el => el.id), // based on MRIDS,
    this.availableIds = useCases.mockResponseIds;
  }

  deleteClicked(event) {
    this.mockResponseService.deleteMockResponse(event.id)
      .subscribe( (resp: any) => this.setMockResponses({key:''}) );
  }

  async activateClicked(event) {
    await this.mockResponseService.activateMockResponse(event.id).toPromise();
    this.setMockResponses({key:''});
  }

  async deactivateClicked(event) {
    await this.mockResponseService.deactivateMockResponse(event.id).toPromise();
    this.setMockResponses({key:''});
  }
}
