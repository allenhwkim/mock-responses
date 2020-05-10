import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faEdit, faTrashAlt, faPlusCircle } from '@fortawesome/free-solid-svg-icons';

import { AuthorizedServiceService } from '../../authorized.service';
import { MockResponsesService } from '../mock-responses.service';

interface MockResponse {
  id?: string;
  name?: string;
  req_method?: string;
  req_url?: string;
  req_payload?: string;
  res_status?: number;
  res_content_type?: string;
  res_delay_sec?: number;
  res_body?: string;
}

@Component({
  selector: 'app-mock-response-edit',
  templateUrl: './mock-response-edit.component.html',
  styleUrls: ['./mock-response-edit.component.scss']
})
export class MockResponseEditComponent implements OnInit {
  @ViewChild('resBody') resBody: ElementRef;

  mockResponse: MockResponse = {};
  faEdit = faEdit; faPlusCircle = faPlusCircle; faTrashAlt = faTrashAlt;

  constructor(
    public auth: AuthorizedServiceService,
    private mockResp: MockResponsesService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.mockResp.getMockResponse(id)
      .subscribe((resp:any) => {
        this.mockResponse = resp;
        setTimeout(_ => this.autoGrow());
      });
  }

  beautifyJSON() {
    const jsObj = JSON.parse(this.mockResponse.res_body);
    this.mockResponse.res_body = JSON.stringify(jsObj, null, '  ');
    this.autoGrow();
  }

  updateMockResponse() {
  }

  createMockResponse() {
  }

  deleteMockResponse() {
  }

  autoGrow() {
    const element = this.resBody.nativeElement;
    if (element.scrollHeight > 30) { 
      element.style.height = '5px';
      element.style.height = `${element.scrollHeight}px`;
    }
  }

  
}
