import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MockResponsesComponent } from './mock-responses/mock-responses.component';
import { UseCasesComponent } from './use-cases/use-cases.component';
import { MockResponseEditComponent } from './mock-responses/mock-response-edit/mock-response-edit.component';
import { UseCaseEditComponent } from './use-cases/use-case-edit/use-case-edit.component';
import { ActivesComponent } from './actives/actives.component';
import { SetUseCaseComponent } from './actives/set-use-case.component';

const routes: Routes = [
  { path: 'mock-responses/:id/edit', component: MockResponseEditComponent },
  { path: 'mock-responses/new', component: MockResponseEditComponent },
  { path: 'mock-responses', component: MockResponsesComponent },
  { path: 'use-cases/:id/edit', component: UseCaseEditComponent },
  { path: 'use-cases/new', component: UseCaseEditComponent },
  { path: 'use-cases', component: UseCasesComponent },
  { path: 'set-use-case', component: SetUseCaseComponent, data: {showHeader: false} },
  { path: 'actives', component: ActivesComponent },
  { path: '', component: MockResponsesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
