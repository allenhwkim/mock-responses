import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthorizedServiceService } from '../../authorized.service';
import { MockResponsesService } from '../mock-responses.service';
import { MockResponse } from 'src/app/models/mock-response.interface';

@Component({
  selector: 'app-mock-response-edit',
  templateUrl: './mock-response-edit.component.html',
  styleUrls: ['./mock-response-edit.component.scss']
})
export class MockResponseEditComponent implements OnInit {
  @ViewChild('resBody') resBody: ElementRef;

  orgMockResponse: MockResponse = {};
  mockResponse: MockResponse = {};

  get updatable() {
    return Object.keys(this.getUpdatedMockResponse()).length > 1; // id is default
  }

  get creatable() {
    const mockResp: MockResponse = this.getUpdatedMockResponse();
    console.log({mockResp})
    return !!(mockResp.name && mockResp.req_url && mockResp.res_body);
  }

  constructor(
    public auth: AuthorizedServiceService,
    private mockResp: MockResponsesService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const from = this.route.snapshot.queryParamMap.get('from');
    if (id) {
      this.mockResp.getMockResponse(id)
        .subscribe((resp:any) => {
          this.orgMockResponse = resp;
          this.mockResponse = {...this.orgMockResponse};
          setTimeout(_ => this.autoGrow());
        });
    } else if (from) {
      this.mockResp.getMockResponse(from)
        .subscribe((resp:any) => {
          this.orgMockResponse = {};
          this.mockResponse = resp;
          this.mockResponse.id = undefined;
          setTimeout(_ => this.autoGrow());
        });
    }
  }

  beautifyJSON() {
    const jsObj = JSON.parse(this.mockResponse.res_body);
    this.mockResponse.res_body = JSON.stringify(jsObj, null, '  ');
    setTimeout( _ => this.autoGrow());
  }

  getUpdatedMockResponse() {
    const updated = {id: this.mockResponse.id};
    for(var key in this.mockResponse) {
      if (this.orgMockResponse[key] !== this.mockResponse[key]) {
        updated[key] = this.mockResponse[key];
      }
    }
    return updated;
  }

  updateMockResponse() {
    const updated = this.getUpdatedMockResponse();
    if (Object.keys(updated).length > 1) {
      this.mockResp.updateMockResponse(updated)
        .subscribe(resp => this.router.navigate(['/mock-responses']) );
    }
  }

  createMockResponse() {
    const updated = this.getUpdatedMockResponse();
    this.mockResp.createMockResponse(updated)
      .subscribe(resp => this.router.navigate(['/mock-responses']) );
  }

  deleteMockResponse() {
    this.mockResp.deleteMockResponse(this.mockResponse.id)
      .subscribe(resp => this.router.navigate(['/mock-responses']) );
  }

  autoGrow() {
    const element = this.resBody.nativeElement;
    if (element.scrollHeight > 30) { 
      element.style.height = '5px';
      element.style.height = `${element.scrollHeight}px`;
    }
  }

}
