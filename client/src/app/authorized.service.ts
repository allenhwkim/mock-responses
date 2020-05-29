import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class AuthorizedServiceService {
  get key() {
    return sessionStorage.getItem('auth-key');
  };

  set key(val) {
    if (val === '2') {
      sessionStorage.setItem('auth-key', val);
    } else {
      sessionStorage.removeItem('auth-key');
    }
  }

  get authorized() {
    return this.key === '2';
  }

  constructor() { }
}
