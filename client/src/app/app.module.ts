import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppRoutingModule } from './app.route';
import { AppComponent } from './app.component';
import { MockResponsesComponent } from './mock-responses/mock-responses.component';
import { UseCasesComponent } from './use-cases/use-cases.component';
import { MockResponseEditComponent } from './mock-responses/mock-response-edit/mock-response-edit.component';
import { MockResponsesListComponent } from './mock-responses/mock-responses-list/mock-responses-list.component';
import { UseCaseEditComponent } from './use-cases/use-case-edit/use-case-edit.component';
import { UseCasesListComponent } from './use-cases/use-cases-list/use-cases-list.component';
import { HomeComponent } from './home/home.component';
import { SetUseCaseComponent } from './home/set-use-case.component';
import { UseCaseDialogComponent } from './dialogs/use-case-dialog.component';
import { MockResponseDialogComponent } from './dialogs/mock-response-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    MockResponsesComponent,
    MockResponseEditComponent,
    MockResponsesListComponent,
    MockResponseDialogComponent,
    UseCasesComponent,
    UseCaseEditComponent,
    UseCasesListComponent,
    UseCaseDialogComponent,
    HomeComponent,
    SetUseCaseComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatSnackBarModule,
    MatDialogModule,
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent],

})
export class AppModule { }
