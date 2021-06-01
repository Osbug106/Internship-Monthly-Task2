import { ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { type } from 'jquery';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'main-chat',
  templateUrl: './main-chat.component.html',
  styleUrls: ['./main-chat.component.scss']
})
export class MainChatComponent implements OnChanges {
  @Input() receiver;
  @Input() channelId;
  @ViewChild('chatArea') chatArea: ElementRef;
  @ViewChild('message') message: ElementRef;
  userID = this.getCookie("user");
  chatID;
  messages;

  constructor(private chatService: ChatService, private route: Router, private changeRef: ChangeDetectorRef) {
    this.chatService.listen('message')
      .subscribe(
        (data) => {
          // console.log("Data back from socket server: ", data);
          if (data.chatId === this.chatID) {
            this.messages.push(data);
          }
        },
        (error) => {
          console.log("Error in main-chat socket: ", error);
        });
  }

  ngOnChanges(change: SimpleChanges) {
    this.changeRef.detectChanges();
    if (this.channelId !== "") {
      this.chatService.getMessages(this.channelId)
        .subscribe(
          (messages) => {
            this.messages = messages;
          },
          (error) => {
            console.log("Error in fetching messages: ", error);
          },
          () => {
            // console.log("Messages fetched successfully.", this.messages);
          }
        );
    }
    this.chatID = this.channelId;
    this.channelId = "";
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    this.chatArea.nativeElement.scrollTop = this.chatArea.nativeElement.scrollHeight;
  }

  sendMessage() {
    var newMessage = this.message.nativeElement.value;
    var msg = {
      message: {
        type: "text",
        body: {
          text: newMessage,
          files: []
        }
      },
      chatId: this.chatID,
      sender: {
        id: { _id: this.userID }
      },
      receiver: {
        id: { _id: this.receiver.id._id }
      }
    }
    // this.messages.push(msg);
    this.chatService.emit('message', msg);
    this.message.nativeElement.value = "";
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
