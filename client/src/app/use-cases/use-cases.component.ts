import { Component, OnInit } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { UseCasesService } from './use-cases.service';
import { AuthorizedServiceService } from '../authorized.service';

@Component({
  selector: 'app-use-cases',
  templateUrl: './use-cases.component.html',
  styleUrls: ['./use-cases.component.scss']
})
export class UseCasesComponent implements OnInit {
  useCases: any;
  faPlus = faPlus;

  constructor(
    private useCaseService: UseCasesService,
    public auth: AuthorizedServiceService
  ) { }

  ngOnInit() {
    this.setUseCases({key: ''});
  }

  setUseCases(by) {
    this.useCaseService.getUseCases(by)
      .subscribe( (resp:any) => {
        this.useCases = resp.useCases;
      })
  }
}
