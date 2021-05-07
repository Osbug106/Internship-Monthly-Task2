import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainContentComponent } from './components/main-content/main-content.component';

const routes: Routes = [
  {
    path: 'products/p/:id', component:MainContentComponent
  },
  {
    path: 'products/:id', component:MainContentComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
