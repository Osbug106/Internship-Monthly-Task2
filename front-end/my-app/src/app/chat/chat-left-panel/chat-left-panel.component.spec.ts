import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatLeftPanelComponent } from './chat-left-panel.component';

describe('ChatLeftPanelComponent', () => {
  let component: ChatLeftPanelComponent;
  let fixture: ComponentFixture<ChatLeftPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatLeftPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatLeftPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
