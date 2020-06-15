import { Component, OnInit } from '@angular/core';

import { UseCasesService } from '../use-cases/use-cases.service';
import { UseCase } from '../models/use-case.interface';

@Component({
  selector: 'app-set-use-case',
  templateUrl: './set-use-case.component.html',
  styleUrls: ['./set-use-case.component.scss']
})
export class SetUseCaseComponent implements OnInit {
  activeUseCases: any = [];
  filteredUseCases = [];
  useCases : any = {useCases: []}; // API response

  constructor(
    private useCaseService: UseCasesService
  ) {}

  ngOnInit() {
    this._setProperties();
  }

  activateUseCase(useCase: UseCase) {
    const activeIds = this.activeUseCases.map(el => el.id);
    const activate = !activeIds.includes(useCase.id);
    const activateStr = activate ? 'activate' : 'deactivate';
    const result = 
      window.confirm(`Do you want to ${activateStr} use case ${useCase.id}-${useCase.name}"?`);
    if (result) {
      const deactivates = (this.activeUseCases || [])
        .map(el => this.useCaseService.deactivateUseCase(el.id).toPromise());
      Promise.all(deactivates).then(resps => {
        return activate ?
          this.useCaseService.activateUseCase(useCase.id).toPromise() : Promise.resolve({});
      }).then(resp => {
        this._setProperties();
      });
    }
  }

  _setProperties() {
    return this.useCaseService.getUseCases({key: ''}).toPromise()
      .then((resp: any) => {
        this.useCases = resp;
        this.filteredUseCases = this.useCases.useCases;
      })
      .then(resp => this.useCaseService.getUseCases({activeOnly: 1}).toPromise())
      .then((resp:any) => this.activeUseCases = resp.activeUseCases );
  }

  isActive(useCase) {
    return this.activeUseCases.map(el => el.id).includes(useCase.id);
  }

  filter(by) {
    if (by.group) {
      const min = Math.floor(by.group / 100) * 100;
      const max = min + 100;
      this.filteredUseCases = this.useCases.useCases.filter(el => {
        return el.id >= min && el.id < max;
      }).sort( (a, b) => a.id > b.id ? 1 : -1);
    } else if ( by.key !== undefined) {
      this.filteredUseCases = this.useCases.useCases.filter(el => {
        return el.name.includes(by.key) || el.description.includes(by.key);
      })
    }
  }

}
