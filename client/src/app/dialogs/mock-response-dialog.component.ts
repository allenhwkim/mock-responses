import { Component, Inject, Output, OnInit, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { MockResponsesService } from '../mock-responses/mock-responses.service';
import { MockResponse } from '../models/mock-response.interface';

@Component({
  selector: 'app-mock-response-dialog',
  templateUrl: './mock-response-dialog.component.html',
  styles: [`
    .res_body {
      max-width: 800px;
      max-height: 400px;
      white-space: pre-wrap;
      word-wrap: break-word;
      overflow: auto;
    }`]
})
export class MockResponseDialogComponent implements OnInit {
  mockResponse: MockResponse;

  constructor(
    public dialogRef: MatDialogRef<MockResponseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public mockResponseService: MockResponsesService
  ) {}

  ngOnInit() {
    this.mockResponse = this.data.mockResponse;
    this.mockResponse.created_at = new Date(this.mockResponse.created_at);
    this.mockResponse.updated_at = new Date(this.mockResponse.updated_at);
    // this.mockResponseService.getMockResponse(this.data.mockResponse.id)
    //   .subscribe( (resp: any) => this.mockResponse = resp );
  }

}