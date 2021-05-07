import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppMenuListItemComponent } from './app-menu-list-item.component';

describe('AppMenuListItemComponent', () => {
  let component: AppMenuListItemComponent;
  let fixture: ComponentFixture<AppMenuListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppMenuListItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppMenuListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
