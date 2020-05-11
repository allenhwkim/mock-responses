import { Component, Inject, Output, OnInit, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UseCasesService } from '../use-cases/use-cases.service';

@Component({
  selector: 'app-use-case-dialog',
  template: `
    <input class="use-case-search" size="40" 
      (keyup)="searchTermChanged($event)"
      placeholder="Type to search use-cases" />
    <app-use-cases-list
      [useCases]="useCases"
      [dialogMode]="true"
      [activeUseCase]="data?.activeUseCase"
      [activate]="data?.activate"
      [collectionMode]="data?.collectionMode"
      (selectClicked)="selectClicked.emit($event)"
      (deleteClicked)="deleteClicked.emit($event)"
      (searchTermChanged)="searchTermChanged($event)">
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
    @Inject(MAT_DIALOG_DATA) public data: any,
    public useCaseService: UseCasesService
  ) {}

  ngOnInit() {
    this.useCaseService.getUseCases({key: ''})
      .subscribe( (resp: any) => {
        this.useCases = resp.useCases
      });
        
  }

  searchTermChanged(event) {
    this.useCaseService.getUseCases({key: event.target.value})
      .subscribe( (resp: any) => this.useCases = resp.useCases);
  }

}