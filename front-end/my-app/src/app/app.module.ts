import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

//modules
import { AppRoutingModule } from './app-routing.module';
import { ChatModule } from './chat/chat.module';
import { ChatRoutingModule } from './chat/chat-routing.module';

//components
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { ImageZoomComponent } from './components/image-zoom/image-zoom.component';
import { AppMenuListItemComponent } from "./components/app-menu-list-item/app-menu-list-item.component";
import { LeftNavComponent } from './components/left-nav/left-nav.component';
import { MainContentComponent } from './components/main-content/main-content.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

import { MaterialModule } from './angularMaterial/material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from "@angular/flex-layout";
import { NgxPaginationModule} from 'ngx-pagination';
import { MoveBackgroundDirective } from './components/directives/move-background.directive';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LeftNavComponent,
    MainContentComponent,
    AppMenuListItemComponent,
    ImageZoomComponent,
    MoveBackgroundDirective,
    PageNotFoundComponent,
    LoginComponent,
    RegisterComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    ChatRoutingModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    FlexLayoutModule,
    NgxPaginationModule,
    FontAwesomeModule,
    ChatModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
