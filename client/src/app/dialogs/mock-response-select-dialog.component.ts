import { Component, Inject, Output, OnInit, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MockResponsesService } from '../mock-responses/mock-responses.service';

@Component({
  selector: 'app-mock-response-select-dialog',
  template: `
    <app-mock-responses-list
      [mockResponses]="mockResponses"
      [dialogMode]="true"
      [collectionMode]="true"
      (playClicked)="mockResponseService.play($event)"
      (selectClicked)="selectClicked.emit($event)"
      (unselectClicked)="unselectClicked.emit($event)"
      (searchTermChanged)="searchTermChanged($event)">
      <input class="mock-response-search" size="40" 
        (change)="searchTermChanged($event)"
        placeholder="Type to search mock responses" />
    </app-mock-responses-list>
  `
})
export class MockResponseSelectDialogComponent implements OnInit {
  @Output() selectClicked = new EventEmitter();
  @Output() unselectClicked = new EventEmitter();

  mockResponses: any;

  constructor(
    public dialogRef: MatDialogRef<MockResponseSelectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public mockResponseService: MockResponsesService
  ) {}

  ngOnInit() {
    this.mockResponseService.getMockResponses({key: ''})
      .subscribe( (resp: any) => this.mockResponses = resp.mockResponses);
  }

  searchTermChanged(event) {
    this.mockResponseService.getMockResponses({key: event.target.value})
      .subscribe( (resp: any) => this.mockResponses = resp.mockResponses);
  }

}