import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthorizedServiceService } from '../../authorized.service';
import { UseCasesService } from '../use-cases.service';
import { faEdit, faFile, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { UseCaseDialogComponent } from 'src/app/dialogs/use-case-dialog.component';

@Component({
  selector: 'app-use-cases-list',
  templateUrl: './use-cases-list.component.html',
  styleUrls: ['./use-cases-list.component.scss']
})
export class UseCasesListComponent implements OnInit {
  @Input() useCases: any;
  @Input() collectionMode: boolean; // open a dialog, and select one
  @Input() listMode: boolean; // list selected ones, and unselect one
  @Input() activateMode: boolean; // enable activate a use case

  @Output() deleteClicked = new EventEmitter();
  @Output() selectClicked = new EventEmitter();

  faEdit = faEdit; faFile = faFile; faTrashAlt = faTrashAlt;

  constructor(
    public auth: AuthorizedServiceService,
    public useCasesService: UseCasesService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }
  
  openUseCaseDialog(useCase) {
    const dialogRef = this.dialog.open(UseCaseDialogComponent, { data: { useCase } });
  }

  
}
