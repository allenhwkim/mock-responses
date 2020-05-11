import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({providedIn: 'root'})
export class UseCasesService {

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  getUseCases(options) {
    const url = `/use-cases?` + 
      `q=${options.key||''}&ids=${options.ids||''}`;
    return this.http.get(url);
  }

  getUseCase(id) {
    return this.http.get(`/use-cases/` + id);
  }

  activateUseCase(id) {
    return this.http.put(`/use-cases/${id}/activate`, {});
  }

  updateUseCase(useCases) {
    return this.http.put(`/use-cases/` + useCases.id, useCases);
  }

  createUseCase(useCases) {
    return this.http.post(`/use-cases`, useCases);
  }

  deleteUseCase(id) {
    return this.http.delete(`/use-cases/` + id);
  }

}
