import { ChangeDetectorRef, Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'chat-header',
  templateUrl: './chat-header.component.html',
  styleUrls: ['./chat-header.component.scss']
})
export class ChatHeaderComponent implements OnInit {

  @Input() sidenav: any;
  constructor(private change: ChangeDetectorRef, private chatService: ChatService) { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    this.change.detectChanges();
  }

  setNewChat() {
    this.chatService.NewChat();
  }

  setGroupChat() {
    this.chatService.GroupChat();
  }

  setPersonalChat() {
    this.chatService.PersonalChat();
  }
}
