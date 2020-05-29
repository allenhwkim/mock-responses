import { Component, Inject, Output, OnInit, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UseCasesService } from '../use-cases/use-cases.service';
import { UseCase } from '../models/use-case.interface';
import { BlockScrollStrategy } from '@angular/cdk/overlay';

@Component({
  selector: 'app-use-case-dialog',
  templateUrl: './use-case-dialog.component.html',
  styles: [`.method {display: inline-block; width: 60px;}`]
})
export class UseCaseDialogComponent implements OnInit {
  id: any;
  name: any;
  description: any;
  useCases = [];
  mockResponses = [];
  useCase: UseCase;

  constructor(
    public dialogRef: MatDialogRef<UseCaseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public useCaseService: UseCasesService
  ) {}

  ngOnInit() {
    this.useCaseService.getUseCase(this.data.useCase.id)
      .subscribe( (resp: any) => this.useCase = resp );
  }

}