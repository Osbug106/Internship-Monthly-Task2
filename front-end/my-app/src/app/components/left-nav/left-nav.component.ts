import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, ViewEncapsulation, OnInit, Output, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { FetchCategoriesService } from 'src/app/services/fetch-categories.service';


@Component({
  selector: 'app-left-nav',
  templateUrl: './left-nav.component.html',
  styleUrls: ['./left-nav.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LeftNavComponent{

  @ViewChild('sidenav')
  sidenav: MatSidenav;

  categories: any = [];
  sortedCategories: any[] = [];
  navItems: any[] = [];

  constructor(private observer: BreakpointObserver, private changeRef: ChangeDetectorRef, private Service: FetchCategoriesService) {
    this.Service.getCategories()
    .subscribe(
      (categories: any) => {
        this.categories = categories;
        this.sortingCat();
      },
      error => {
        console.log("Fetch Categories Error: ", error);
      },
      () => {
        console.log("Fetch categories complete.")
      });
  }
  
  ngAfterViewChecked(): void { this.changeRef.detectChanges(); }
  
  ngAfterViewInit():any {
    this.observer.observe(['(max-width: 1125px)']).subscribe((res) => {
      if (res.matches) {
        this.sidenav.mode = 'over';
        this.sidenav.close();
      } else {
        this.sidenav.mode = 'side';
        this.sidenav.open();
      }
    });
  }

  getCategoriesByparent(parent):any {
    let $categories = [];
    for (let c of this.categories) {
      if (c.parent && c.parent === parent) {
        $categories.push(c);
      }
    }
    return $categories;
  }
  getL1Categories():any {
    let $categories = [];
    for (let c of this.categories) {
      if (c.parent === undefined) {
        $categories.push(c);
      }
    }
    return $categories;
  }

  sortingCat()
  {
    if (this.categories.length > 0 && this.sortedCategories.length === 0) {
      this.sortedCategories =
      (function sortCat($categories: any, id: any) {
        if ($categories.length === 0) {
          $categories = this.getL1Categories();
          return sortCat.call(this, $categories, []);
        }
        for (let c of $categories) {
          c.children = this.getCategoriesByparent(c._id);
          if (c.parent) {
            id = id || [];
            c.parents = Array.from(id);
          }
          let arr = Array.from(c.parents || []);
          arr.push(c._id);
          if (c.children.length !== 0)
          {
            sortCat.call(this, c.children, arr);
          }
        }
        return $categories;
      }).call(this, [], []);
    }
    // console.log("Sorted Categories: ", this.sortedCategories);
  }

  call()
  {
    if(this.sortedCategories)
    {
      return true;
    }
  }
}
