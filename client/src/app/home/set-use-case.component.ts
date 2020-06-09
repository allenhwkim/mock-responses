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
  useCases : any = {useCases: []};

  constructor(
    private useCaseService: UseCasesService
  ) {}

  ngOnInit() {
    this._setProperties();
  }

  activateUseCase(useCase: UseCase) {
    const result = window.confirm(`Do you want to activate use case "${useCase.name}"?`);
    if (result) {
      const deactivates = (this.activeUseCases || [])
        .map(el => this.useCaseService.deactivateUseCase(el.id).toPromise());

      Promise.all(deactivates).then(resps => {
        return this.useCaseService.activateUseCase(useCase.id).toPromise();
      }).then(resp => {
        this._setProperties();
      });
    }
  }

  _setProperties() {
    return this.useCaseService.getUseCases({key: ''}).toPromise()
      .then((resp: any) => this.useCases = resp)
      .then((resp: any) => this.useCaseService.getUseCases({activeOnly: 1}).toPromise())
      .then((resp: any) => this.activeUseCases = resp.activeUseCases);
  }

  isActive(useCase) {
    return this.activeUseCases.map(el => el.id).includes(useCase.id);
  }

}
