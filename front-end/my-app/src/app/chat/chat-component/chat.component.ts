import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  @Input() sideNav: any;
  userID = this.getCookie("user");

  constructor(private change: ChangeDetectorRef, private loginService: LoginService, private router: Router, private chatService: ChatService) {

    this.chatService.connectToSocket(this.userID);
  }

  ngOnInit(): void {
    if (!this.loginService.loggedIn()) {
      this.router.navigate(['/login']);
    }
  }

  checkChatNav(nav) {
    this.sideNav = nav;
    this.change.detectChanges();
  }

  getCookie(name) {
    var cookieArr = document.cookie.split(";");

    for (var i = 0; i < cookieArr.length; i++) {
      var cookiePair = cookieArr[i].split("=");
      if (name == cookiePair[0].trim()) {
        return cookiePair[1];
      }
    }
    return null;
  }

}
