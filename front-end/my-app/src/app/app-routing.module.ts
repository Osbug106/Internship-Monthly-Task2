import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeftNavComponent } from './components/left-nav/left-nav.component';
import { LoginComponent } from './components/login/login.component';
import { MainContentComponent } from './components/main-content/main-content.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { RegisterComponent } from './components/register/register.component';

const routes: Routes = [
  {
    path: '', component:LeftNavComponent,
    children: [
      {
        path: 'products/p/:id', component:MainContentComponent
      },
      {
        path: 'products/:id', component:MainContentComponent
      }
    ],
  },
  {
    path: 'register', component: RegisterComponent
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: '**', component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
