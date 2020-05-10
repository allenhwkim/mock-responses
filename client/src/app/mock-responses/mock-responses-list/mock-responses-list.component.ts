import { Component, OnInit, Input, Output } from '@angular/core';
import { AuthorizedServiceService } from '../../authorized.service';
import { MockResponsesService } from '../mock-responses.service';
import { EventEmitter } from 'events';

@Component({
  selector: 'app-mock-responses-list-component',
  templateUrl: './mock-responses-list-component.component.html',
  styleUrls: ['./mock-responses-list-component.component.scss']
})
export class MockResponsesListComponentComponent implements OnInit {
  @Input() mockResponses: any;
  @Input() collectionMode: boolean;
  @Input() dialogMode: boolean;

  @Output() playClicked = new EventEmitter();
  @Output() unselectClicked = new EventEmitter();
  @Output() selectClicked = new EventEmitter();

  constructor(
    private auth: AuthorizedServiceService,
    private mockResponseService: MockResponsesService
  ) { }

  ngOnInit(): void {
  }
  
}
