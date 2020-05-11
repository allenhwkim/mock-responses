import { Component, Inject, Output, OnInit, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MockResponsesService } from '../mock-responses/mock-responses.service';

@Component({
  selector: 'app-mock-response-dialog',
  template: `
    <app-mock-responses-list
      [mockResponses]="mockResponses"
      [dialogMode]="true"
      [collectionMode]="data?.collectionMode"
      (playClicked)="mockResponseService.play($event)"
      (selectClicked)="selectClicked.emit($event)"
      (deleteClicked)="deleteClicked.emit($event)"
      (searchTermChanged)="searchTermChanged($event)">
      <input class="mock-response-search" size="40" 
        (change)="searchTermChanged($event)"
        placeholder="Type to search mock responses" />
    </app-mock-responses-list>
  `
})
export class MockResponseDialogComponent implements OnInit {
  @Output() selectClicked = new EventEmitter();
  @Output() deleteClicked = new EventEmitter();

  mockResponses: any;

  constructor(
    public dialogRef: MatDialogRef<MockResponseDialogComponent>,
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