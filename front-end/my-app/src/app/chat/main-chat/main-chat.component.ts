import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'main-chat',
  templateUrl: './main-chat.component.html',
  styleUrls: ['./main-chat.component.scss']
})
export class MainChatComponent implements OnChanges, OnInit {
  @Input() receiver: any;
  @Input() channelId;
  @ViewChild('chatArea') chatArea: ElementRef;
  @ViewChild('message') message: ElementRef;
  @ViewChild('file_input') file_input: ElementRef;
  @ViewChild('newChatInput') newChatInput: ElementRef;
  @ViewChild('newGroupName') newGroupName: ElementRef;
  userID = this.getCookie("user");
  chatID: any;
  messages: any;
  chatType: any;
  connects: any = [];
  openNewChat: boolean;
  newChatReciever: any;
  onlineUsers: any = [];
  searchConnects: any = [];
  groupNameNotEntered: boolean;
  newGroupChatMembers: any = [];
  groupChat: boolean = false;
  selectedImagesToSend: any = [];
  moreChatOptions: boolean = false;
  chatSizeOnMedia: boolean = false;
  selectedImagesToDisplay: any = [];

  constructor(private chatService: ChatService, private route: Router, private changeRef: ChangeDetectorRef) {
    this.chatService.listen('message')
      .subscribe(
        (data) => {
          console.log("Data back from socket server: ", data.message);
          if (data.chatId === this.chatID) {
            this.messages.push(data);
            this.scrollToBottom();
          }
        },
        (error) => {
          console.log("Error in main-chat socket: ", error);
        },
        () => {
        });
    this.getonlineUsers();
  }

  ngOnInit() {
    this.chatService.isNewChat
      .subscribe(data => {
        this.openNewChat = data;
        if (this.openNewChat) {
          this.chatService.getAllConnects(this.userID)
            .subscribe(
              (data: any) => {
                data.forEach(val => {
                  if (val.connectWith._id !== this.userID) {
                    this.connects.push(val.connectWith);
                  }
                  else {
                    this.connects.push(val.connector);
                  }
                });
              },
              (error) => {
                console.log("Error in fetching connects: ", error);
              }
            )
        }
        this.changeRef.detectChanges();
      });
  }

  ngOnChanges(change: SimpleChanges) {
    this.changeRef.detectChanges();
    if (this.channelId !== "") {
      this.chatService.getMessages(this.channelId)
        .subscribe(
          (messages) => {
            this.messages = messages;
            setTimeout(() => {
              this.scrollToBottom();
            }, 0);
          },
          (error) => {
            console.log("Error in fetching messages: ", error);
          },
          () => {
            // console.log("Messages fetched successfully.", this.messages);
          }
        );
      this.moreChatOptions = false;
    }
    this.chatID = this.channelId;
    this.channelId = "";
  }

  scrollToBottom(): void {
    if (!this.openNewChat) {
      this.chatArea.nativeElement.scrollTop = this.chatArea.nativeElement.scrollHeight;
    }
  }

  sendMessage() {
    var newMessage = this.message.nativeElement.value;
    var msg

    if (this.receiver.chatType !== 'group') {
      if (newMessage === "") return;
      msg = {
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
      this.chatService.emit('message', msg);
    }
    else {
      if (newMessage === "") return;
      msg = {
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
          id: { _id: this.receiver.participants[0].userId }
        },
        participants: this.receiver.participants
      }
      // this.messages.push(msg);
      this.chatService.emit('groupMessage', msg);
    }
    this.message.nativeElement.value = "";
    this.scrollToBottom();
  }

  checkSelectedFile() {
    var acceptedFileTypes = [
      "image/png",
      "image/gif",
      "image/jpg",
      "image/jpeg",
      "video/mp4",
      "video/ogv",
      "video/webm"
    ];
    var newFile = this.file_input.nativeElement.files;
    var supportedFiles = [];
    var count = newFile.length;

    for (let i = 0; i < count; i++) {
      if (acceptedFileTypes.includes(newFile[i].type)) {
        supportedFiles.push(newFile[i]);
      }
    }

    this.selectedImagesToSend = supportedFiles;
    count = supportedFiles.length;

    for (let i = 0; i < count; i++) {
      let fileReader = new FileReader();
      fileReader.onload = (result) => {
        this.selectedImagesToDisplay.push(result.target);
      };
      fileReader.readAsDataURL(supportedFiles[i]);
    }

    if (supportedFiles.length) {
      this.chatSizeOnMedia = true;
    }
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

  chatSize() {
    return this.chatSizeOnMedia;
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

  checkOnlineUsers(receiver) {
    if (receiver.chatType === 'group') {
      return false;
    }
    else {
      return this.onlineUsers.includes(receiver.id._id);
    }
  }

  getConnections(val) {
    this.searchConnects = [];
    if (val.length > 2) {
      this.connects.forEach(connect => {
        if (connect.username.includes(val)) {
          this.searchConnects.push(connect)
        }
      });
    }
  }

  startNewChat(connect) {
    if (!this.groupChat) {
      this.newChatReciever = connect;
      this.newChatInput.nativeElement.value = "";
      this.searchConnects = [];
    }
    else {
      this.newGroupChatMembers.push(connect);
      this.newChatInput.nativeElement.value = "";
      this.searchConnects = [];
    }
  }

  allowToAddMembers() {
    this.groupChat = true;
  }

  allowNewChat() {
    this.groupChat = false;
  }

  sendNewMessage() {
    var newMessage = this.message.nativeElement.value;
    var msg;
    if (!this.groupChat) {
      if (newMessage === "") return;
      msg = {
        message: {
          type: "text",
          body: {
            text: newMessage,
            files: []
          }
        },
        chatId: "",
        sender: {
          id: { _id: this.userID }
        },
        receiver: {
          id: { _id: this.newChatReciever._id }
        },
        chatType: ""
      }
      this.chatService.emit('newChatMessage', msg);
    }
    else {
      if (this.newGroupName.nativeElement.value === "") {
        this.groupNameNotEntered = true;
        return;
      }
      else {
        this.groupNameNotEntered = false;
      }
      if (newMessage === "") return;
      msg = {
        message: {
          type: "text",
          body: {
            text: newMessage,
            files: []
          }
        },
        chatId: "",
        sender: {
          id: { _id: this.userID }
        },
        chatType: "group",
        chatSubject: this.newGroupName.nativeElement.value,
        participants: this.newGroupChatMembers,
      }
      this.chatService.emit('newGroup', msg);
    }
    this.newGroupChatMembers = [];
    this.message.nativeElement.value = "";
    this.newGroupName.nativeElement.value = "";
  }

  moreChatOptionToggle() {
    if (this.moreChatOptions == false) {
      this.moreChatOptions = true;
    }
    else {
      this.moreChatOptions = false;
    }
  }

  checkIfDelete(message) {
    message.deletedBy.forEach((user) => {
      if (user.userId === this.userID) {
        return false;
      }
    });
    return true;
  }

  clearChat() {
    this.chatService.emit("clearChat", { chatId: this.chatID, userId: this.userID });
    this.moreChatOptions = false;
  }

  markUnread() {
    this.chatService.emit("markUnread", { chatId: this.chatID, userId: this.userID });
    this.moreChatOptions = false;
  }

  markRead() {
    this.chatService.emit("markRead", { chatId: this.chatID, userId: this.userID });
    this.moreChatOptions = false;
  }
}
