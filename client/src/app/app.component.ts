import { Component, OnInit } from '@angular/core';
import { AuthorizedServiceService } from './authorized.service';
import { Router, RoutesRecognized } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  authKey: string;
  showHeader: boolean = true;
  
  constructor(
    private authorizedService: AuthorizedServiceService,
    private router: Router,
  ) {}

  authorizedChanged(event) {
    this.authorizedService.key = event.key;
    this.authKey = event.key;
  }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof RoutesRecognized) {
        this.showHeader = event.state.root.firstChild.data.showHeader === false ? false : true;
      }
    });
  }
}
