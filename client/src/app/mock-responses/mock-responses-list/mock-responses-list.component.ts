import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthorizedServiceService } from '../../authorized.service';
import { MockResponsesService } from '../mock-responses.service';
import { faPlay, faEdit, faFile, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-mock-responses-list',
  templateUrl: './mock-responses-list.component.html',
  styleUrls: ['./mock-responses-list.component.scss']
})
export class MockResponsesListComponent implements OnInit {
  @Input() mockResponses: any;
  @Input() collectionMode: boolean;
  @Input() dialogMode: boolean;

  @Output() playClicked = new EventEmitter();
  @Output() unselectClicked = new EventEmitter();
  @Output() selectClicked = new EventEmitter();

  faPlay = faPlay; faEdit = faEdit; faFile = faFile; faTrashAlt = faTrashAlt;

  constructor(
    public auth: AuthorizedServiceService,
    private mockResponseService: MockResponsesService
  ) { }

  ngOnInit(): void {
  }
  
}
