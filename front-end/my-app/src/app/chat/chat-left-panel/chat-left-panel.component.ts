import { Component, OnInit, Output, EventEmitter, ViewChild, Input, ChangeDetectorRef, OnChanges } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ChatService } from '../services/chat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'chat-left-panel',
  templateUrl: './chat-left-panel.component.html',
  styleUrls: ['./chat-left-panel.component.scss']
})
export class ChatLeftPanelComponent implements OnChanges, OnInit {

  @ViewChild('sidenav')
  sidenav: MatSidenav;

  token = this.getCookie("id_token");
  userID = this.getCookie("user");
  chatuser;
  chats;
  onlineUsers = [];

  @Output() sideChat = new EventEmitter<any>();
  reciever;
  channelId = "";

  constructor(private observer: BreakpointObserver, private chatService: ChatService, private router: Router, private changeRef: ChangeDetectorRef) {
    if (this.token) {
      this.chatService.getChats(this.token)
        .subscribe(
          (data) => {
            this.chats = data;
          },
          (error) => {
            console.log("Error in fetching chats: ", error);
          },
          () => {
            // console.log("Chats fetching complete.", this.chats);
          })
    }
    else {
      this.router.navigate['/login'];
    }

    this.updateChats();
    this.getonlineUsers();
  }

  ngOnInit(): void {
    this.reciever = '';
  }

  ngAfterViewInit(): any {
    this.observer.observe(['(max-width: 1125px)']).subscribe((res) => {
      if (res.matches) {
        this.sidenav.mode = 'over';
        this.sidenav.close();
      } else {
        this.sidenav.mode = 'side';
        this.sidenav.open();
      }
    });
    // console.log("Chat-Left-Panel", this.sidenav);
    this.sideChat.emit(this.sidenav);
  }

  checkreciever(chat) {
    if (chat.sender.id._id !== this.userID) {
      return chat.sender.id.username;
    }
    else {
      return chat.receiver.id.username;
    }
  }

  getonlineUsers() {
    this.chatService.listen("getOnlineUsers")
      .subscribe(
        (data) => {
          this.onlineUsers = data;
        },
        (error) => {
          console.log("Error in getting online users: ", error);
        },
      );
  }

  checkOnlineUsers(chat) {
    var recieverId;
    if (chat.sender.id._id !== this.userID) {
      recieverId = chat.sender.id._id;
    }
    else {
      recieverId = chat.receiver.id._id;
    }

    return this.onlineUsers.includes(recieverId);
  }

  showMessages(chat) {

    // console.log(`In chat onclick: ${chat}`);
    if (chat.sender.id._id !== this.userID) {
      this.reciever = chat.sender;
      this.changeRef.detectChanges();
    }
    else {
      this.reciever = chat.receiver;
      this.changeRef.detectChanges();
    }
    this.channelId = chat.channelId;
    // this.router.navigate([`/messages/${chat.channelId}`]);
  }

  getChats() {
    if (this.token) {
      this.chatService.getChats(this.token)
        .subscribe(
          (data) => {
            this.chats = data;
          },
          (error) => {
            console.log("Error in fetching chats: ", error);
          },
          () => {
            // console.log("Chats fetching complete.", this.chats);
          })
    }
    else {
      this.router.navigate['/login'];
    }
  }

  updateChats() {
    this.chatService.listen('updatedchat')
      .subscribe(
        (data) => {
          console.log("updatedchat: ", data[0]);
          var oldChatIndex = this.chats.findIndex((chat) => {
            return chat.channelId == data[0].channelId;
          });
          this.chats.splice(oldChatIndex, 1);
          this.chats.unshift(data[0]);
        },
        (error) => {
          console.log("Error in main-chat socket: ", error);
        });
  }

  ngOnChanges() {
    console.log(`ChannelId parent`, this.channelId);
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
