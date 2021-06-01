import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'chat-header',
  templateUrl: './chat-header.component.html',
  styleUrls: ['./chat-header.component.scss']
})
export class ChatHeaderComponent implements OnInit {

  @Input() sidenav: any;
  constructor(private change: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    this.change.detectChanges();
  }

}
