import {NgModule} from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {LayoutModule} from '@angular/cdk/layout';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatCardModule} from '@angular/material/card';


const material = [
  MatGridListModule,
  MatToolbarModule,
  MatSidenavModule,
  MatListModule,
  MatButtonModule,
  MatIconModule,
  MatDividerModule,
  LayoutModule,
  MatExpansionModule,
  MatCardModule
];

@NgModule({
  imports: [material],
  exports: [material]
})
export class MaterialModule { }
