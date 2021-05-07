import { Component, OnInit, Input } from '@angular/core';
import { LeftNavComponent } from '../left-nav/left-nav.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() sidenav: any;

  constructor() { }

  ngOnInit(): void {
  }

}
