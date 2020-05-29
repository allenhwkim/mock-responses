import { Component } from '@angular/core';
import { AuthorizedServiceService } from './authorized.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  authKey: string;
  
  constructor(private authorizedService: AuthorizedServiceService) {}

  authorizedChanged(event) {
    this.authorizedService.key = event.key;
    this.authKey = event.key;
  }
}
