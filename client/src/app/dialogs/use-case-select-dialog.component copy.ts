import { Component, Inject, Output, OnInit, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UseCasesService } from '../use-cases/use-cases.service';

@Component({
  selector: 'app-use-case-select-dialog',
  template: `
    <app-use-cases-list
      [useCases]="useCases"
      [dialogMode]="true"
      [collectionMode]="true"
      (selectClicked)="selectClicked.emit($event)"
      (unselectClicked)="unselectClicked.emit($event)"
      (searchTermChanged)="searchTermChanged($event)">
      <input class="use-case-search" size="40" 
        (change)="searchTermChanged($event)"
        placeholder="Type to search use-cases" />
    </app-use-cases-list>
  `
})
export class UseCaseSelectDialogComponent implements OnInit {
  @Output() selectClicked = new EventEmitter();
  @Output() unselectClicked = new EventEmitter();

  useCases: any;

  constructor(
    public dialogRef: MatDialogRef<UseCaseSelectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public useCaseService: UseCasesService
  ) {}

  ngOnInit() {
    this.useCaseService.getUseCases({key: ''})
      .subscribe( (resp: any) => this.useCases = resp.mockResponses);
  }

  searchTermChanged(event) {
    this.useCaseService.getUseCases({key: event.target.value})
      .subscribe( (resp: any) => this.useCases = resp.mockResponses);
  }

}