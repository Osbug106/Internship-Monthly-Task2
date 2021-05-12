import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from "@angular/common";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './angularMaterial/material/material.module';
import { HeaderComponent } from './components/header/header.component';
import { LeftNavComponent } from './components/left-nav/left-nav.component';
import { MainContentComponent } from './components/main-content/main-content.component';
import { FlexLayoutModule } from "@angular/flex-layout";
import { AppMenuListItemComponent } from "./components/app-menu-list-item/app-menu-list-item.component";
import { NgxPaginationModule} from 'ngx-pagination';
import { NgxImgZoomModule } from 'ngx-img-zoom';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { ImageZoomComponent } from './components/image-zoom/image-zoom.component';
import { MoveBackgroundDirective } from './components/directives/move-background.directive';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LeftNavComponent,
    MainContentComponent,
    AppMenuListItemComponent,
    ImageZoomComponent,
    MoveBackgroundDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    FlexLayoutModule,
    NgxPaginationModule,
    NgxImgZoomModule,
    NgxImageZoomModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
