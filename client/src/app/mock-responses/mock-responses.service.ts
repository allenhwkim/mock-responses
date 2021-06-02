import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({providedIn: 'root'})
export class MockResponsesService {

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  getMockResponses(options) {
    const url = `/mock-responses?q=${options.key||''}&ids=${options.ids||''}`;
    return this.http.get(url);
  }

  getMockResponse(id) {
    return this.http.get(`/mock-responses/` + id);
  }

  updateMockResponse(mockResponse) {
    return this.http.put(`/mock-responses/` + mockResponse.id, mockResponse);
  }

  createMockResponse(mockResponse) {
    return this.http.post(`/mock-responses`, mockResponse);
  }

  deleteMockResponse(id) {
    return this.http.delete(`/mock-responses/` + id);
  }

  activateMockResponse(id) {
    return this.http.put(`/mock-responses/${id}/activate`, {});
  }

  deactivateMockResponse(id) {
    return this.http.put(`/mock-responses/${id}/deactivate`, {});
  }

  // ARCHIVE - CLIENT (config)
  getConfig() {
    return this.http.get(`/mock-responses/config`).pipe(
      catchError(err => {
        console.log('[mock-responses] error with /mock-responses/config', err);
        return of(false)
      })
    );
  }

  // ARCHIVE - CLIENT (service)
  async backup(data) {
    console.log('[mock-responses] backup', {data})
    const resp: any = await this.getConfig().toPromise();
    if (resp) { // false with any error
      const config = JSON.parse(resp.res_body);
      if (config.archiveUrl) {
        const payload = { userName: 'archive', mockResponse: data };
        try {
          const resp = await this.http.post(config.archiveUrl, payload).toPromise();
          window['addSnackbar'](`Copied ${data.req_url} to ${config.archiveUrl}`);
          return true;
        } catch(err) {
          if (err.status === 0) {
            console.log('[mock-responses] not connecting to', config.archiveUrl, 'saving it for later');
            const storageIds = JSON.parse( localStorage.getItem('archiveIds') || '[]' );
            const ids = [...new Set(storageIds.concat(data.id))];
            localStorage.setItem('archiveIds', JSON.stringify(ids));
          } else {
            throw err;
          }
        }
      } else {
        console.log('[mock-response] skipping backup by not getting config config.archiveUrl');
      }
    } else {
      console.log('[mock-response] skipping backup by not getting config /mock-responses/config');
    }
  }

}