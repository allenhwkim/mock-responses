import { Component, Inject, Output, OnInit, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UseCasesService } from '../use-cases/use-cases.service';

@Component({
  selector: 'app-use-case-dialog',
  template: `
    <input class="use-case-search" size="40" 
      (keyup)="setUseCases({key: $event.target.value})"
      placeholder="Type to search use-cases" />
    <app-use-cases-list
      [useCases]="useCases"
      [activateMode]="data?.activateMode"
      [collectionMode]="data?.collectionMode"
      (selectClicked)="selectClicked.emit($event)"
      (deleteClicked)="deleteClicked.emit($event)">
    </app-use-cases-list>
  `
})
export class UseCaseDialogComponent implements OnInit {
  @Output() selectClicked = new EventEmitter();
  @Output() deleteClicked = new EventEmitter();

  useCases: any;
  collectionMode: boolean;

  constructor(
    public dialogRef: MatDialogRef<UseCaseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public useCaseService: UseCasesService
  ) {}

  ngOnInit() {
    this.setUseCases({key: ''});
  }

  setUseCases(by) {
    this.useCaseService.getUseCases(by)
      .subscribe( (resp: any) => {
        const excludeIds = this.data.except ? this.data.except.map(el => el.id) : [];
        this.useCases = resp.useCases.filter(el => !excludeIds.includes(el.id));
      });
  }

}