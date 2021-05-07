import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NavBarService} from '../../services/nav-bar.service';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-app-menu-list-item',
  templateUrl: './app-menu-list-item.component.html',
  styleUrls: ['./app-menu-list-item.component.scss'],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({transform: 'rotate(0deg)'})),
      state('expanded', style({transform: 'rotate(180deg)'})),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ])
  ]
})
export class AppMenuListItemComponent implements OnInit {

  expanded: boolean = false;
  @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
  @Input() item: any;
  @Input() depth: number;

  constructor(public navService: NavBarService,
              public router: Router) {
    if (this.depth === undefined) {
      this.depth = 0;
    }
  }

  ngOnInit() {
    this.navService.currentUrl.subscribe((url: string) => {
      if (this.item.route && url) {
        // console.log(`Checking '/${this.item.route}' against '${url}'`);
        this.expanded = url.indexOf(`/${this.item.route}`) === 0;
        this.ariaExpanded = this.expanded;
        // console.log(`${this.item.route} is expanded: ${this.expanded}`);
      }
    });
  }

  onItemSelected(item: any) {
    var URL:String = "";
    if (!item.children || !item.children.length) {
      //send route
    }
    if (item.children && item.children.length) {
      this.expanded = !this.expanded;
    }
    // if(item.parents)
    // {
    //   for(let p of item.parents)
    //   {}
    // }
    console.log("Item ID", item._id);
    this.router.navigate([`/products/p/${item._id}`]);
  }
}
