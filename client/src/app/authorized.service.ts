import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class AuthorizedServiceService {
  get authorized() {
    return this.key === '2';
  }
  key : string;

  constructor() { }
}
