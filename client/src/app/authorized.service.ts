import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class AuthorizedServiceService {
  get key() {
    return localStorage.getItem('auth-key');
  };

  set key(val) {
    if (val === '2') {
      localStorage.setItem('auth-key', val);
    } else {
      localStorage.removeItem('auth-key');
    }
  }

  get authorized() {
    return this.key === '2';
  }

  constructor() { }
}
