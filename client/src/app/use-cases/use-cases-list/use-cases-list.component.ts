import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthorizedServiceService } from '../../authorized.service';
import { UseCasesService } from '../use-cases.service';
import { faPlay, faEdit, faFile, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-use-cases-list',
  templateUrl: './use-cases-list.component.html',
  styleUrls: ['./use-cases-list.component.scss']
})
export class UseCasesListComponent implements OnInit {
  @Input() useCases: any;
  @Input() collectionMode: boolean;
  @Input() dialogMode: boolean;

  @Output() unselectClicked = new EventEmitter();
  @Output() selectClicked = new EventEmitter();

  faPlay = faPlay; faEdit = faEdit; faFile = faFile; faTrashAlt = faTrashAlt;

  constructor(
    public auth: AuthorizedServiceService,
    public useCasesService: UseCasesService
  ) { }

  ngOnInit(): void {
  }
  
}
