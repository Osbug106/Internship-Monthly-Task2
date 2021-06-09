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
  groupChats;
  onlineUsers = [];
  unreadChatCount: number;
  @Output() sideChat = new EventEmitter<any>();
  reciever: any;
  channelId = "";
  openNewChat: boolean;
  personalChat: boolean = true;
  groupChat: boolean = false;

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
          });

      this.chatService.getGroupChats(this.token)
        .subscribe(
          (data) => {
            this.groupChats = data;
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
    this.checkChatEvent();

    this.chatService.isPersonalChat
      .subscribe((data) => {
        this.personalChat = data;
      });

    this.chatService.isGroupChat
      .subscribe((data) => {
        this.groupChat = data;
      });
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
    if (chat.chatType !== 'group') {
      if (chat.sender.id._id !== this.userID) {
        this.reciever = chat.sender;
        this.changeRef.detectChanges();
      }
      else {
        this.reciever = chat.receiver;
        this.changeRef.detectChanges();
      }
      this.channelId = chat.channelId;

      if (chat.unreadMessageCount[0].userId === this.userID) {
        chat.unreadMessageCount[0].totalUnread = 0;
      }
      else {
        chat.unreadMessageCount[1].totalUnread = 0;
      }

      this.chatService.emit("resetUnreadCount", { chatId: chat.channelId, userId: this.userID });

      this.chatService.showMessages();
    }
    else {

      this.reciever = { participants: [...chat.participants], chatSubject: chat.chatSubject, chatType: chat.chatType };
      this.changeRef.detectChanges();

      this.channelId = chat.channelId;

      if (chat.unreadMessageCount[0].userId === this.userID) {
        chat.unreadMessageCount[0].totalUnread = 0;
      }

      chat.unreadMessageCount.forEach((user) => {
        if (user.userId === this.userID) {
          user.totalUnread = 0;
        }
      });

      this.chatService.emit("resetUnreadCount", { chatId: chat.channelId, userId: this.userID });

      this.chatService.showMessages();
    }
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
          if (data[0].chatType !== 'group') {
            var oldChatIndex = this.chats.findIndex((chat) => {
              return chat.channelId == data[0].channelId;
            });
            if (oldChatIndex >= 0) {
              this.chats.splice(oldChatIndex, 1);
            }
            this.chats.unshift(data[0]);
          }
          else {
            console.log("In updateChats (group): ", data[0])
            var oldChatIndex = this.groupChats.findIndex((chat) => {
              return chat.channelId == data[0].channelId;
            });
            if (oldChatIndex >= 0) {
              this.groupChats.splice(oldChatIndex, 1);
            }
            this.groupChats.unshift(data[0]);
          }
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

  checkChatEvent() {
    this.chatService.isNewChat
      .subscribe(
        data => {
          this.openNewChat = data;
        },
        error => {
          console.log("Error in chat-left-panel isNewChat: ", error);
        },
      );
  }
}
