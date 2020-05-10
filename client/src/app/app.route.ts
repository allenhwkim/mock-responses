import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MockResponsesComponent } from './mock-responses/mock-responses.component';
import { UseCasesComponent } from './use-cases/use-cases.component';
import { MockResponseEditComponent } from './mock-responses/mock-response-edit/mock-response-edit.component';

const routes: Routes = [
  { path: 'mock-responses/:id/edit', component: MockResponseEditComponent },
  { path: 'mock-responses/new', component: MockResponseEditComponent },
  { path: 'mock-responses', component: MockResponsesComponent },
  { path: 'use-cases', component: UseCasesComponent },
  { path: '', component: MockResponsesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
