import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthorizedServiceService } from '../../authorized.service';
import { MockResponsesService } from '../mock-responses.service';
import { MockResponseDialogComponent } from '../../dialogs/mock-response-dialog.component';

@Component({
  selector: 'app-mock-responses-list',
  templateUrl: './mock-responses-list.component.html',
  styleUrls: ['./mock-responses-list.component.scss']
})
export class MockResponsesListComponent {
  @Input() mockResponses: any;
  @Input() collectionMode: boolean;
  @Input() listMode: boolean;
  @Input() availableIds: Array<number>;
  @Input() activeIds: Array<number>; 

  @Output() deleteClicked = new EventEmitter();
  @Output() selectClicked = new EventEmitter();
  @Output() activateClicked = new EventEmitter();
  @Output() deactivateClicked = new EventEmitter();

  constructor(
    public auth: AuthorizedServiceService,
    public mockResponseService: MockResponsesService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    const archiveIds = JSON.parse( localStorage.getItem('archiveIds') || '[]' );
    archiveIds.length && this.backupSavedOnes(archiveIds);
  }

  openMockResponseDialog(id) {
    this.mockResponseService.getMockResponse(id).subscribe(resp => {
      const dialogRef = this.dialog.open(MockResponseDialogComponent, { data: { mockResponse: resp } });
    })
  }
  
  // ARCHIVE - CLIENT (bulk)
  backupSavedOnes(mockRespIds) {
    mockRespIds.forEach(async id => {
      const data = await this.mockResponseService.getMockResponse(id).toPromise();
      const result = await this.mockResponseService.backup(data);
      if (result) {
        const archiveIds = JSON.parse( localStorage.getItem('archiveIds') || '[]' );
        const ids = archiveIds.filter(el => el !== id)
        localStorage.setItem('archiveIds', JSON.stringify(ids));
      }
    });
  }
}
