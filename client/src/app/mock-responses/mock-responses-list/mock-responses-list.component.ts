import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthorizedServiceService } from '../../authorized.service';
import { MockResponsesService } from '../mock-responses.service';
import { faEdit, faFile, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-mock-responses-list',
  templateUrl: './mock-responses-list.component.html',
  styleUrls: ['./mock-responses-list.component.scss']
})
export class MockResponsesListComponent implements OnInit {
  @Input() mockResponses: any;
  @Input() collectionMode: boolean;
  @Input() listMode: boolean;

  @Output() deleteClicked = new EventEmitter();
  @Output() selectClicked = new EventEmitter();

  faEdit = faEdit; faFile = faFile; faTrashAlt = faTrashAlt;

  constructor(
    public auth: AuthorizedServiceService,
    public mockResponseService: MockResponsesService
  ) { }

  ngOnInit(): void {
  }
  
}
