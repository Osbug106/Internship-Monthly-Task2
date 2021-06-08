import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client'


@Injectable()
export class ChatService {
  url = "ws://localhost:8080";
  socket: Socket;
  isNewChat = new Subject<boolean>();
  isPersonalChat = new Subject<boolean>();
  isGroupChat = new Subject<boolean>();

  constructor(private http: HttpClient) {
  }

  connectToSocket(userId) {
    this.socket = io(this.url);
    this.socket.emit("newUser", userId);
  }

  listen(eventName): Observable<any> {
    return new Observable(observer => {
      this.socket.on(eventName, (data) => {
        observer.next(data);
      });
    });
  }

  emit(eventName, data) {
    this.socket.emit(eventName, data);
  }

  getChats(token) {
    let header = new HttpHeaders;
    header = header.append('authorization', token);
    header = header.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:8080/chat', { headers: header });
  }

  getGroupChats(token) {
    let header = new HttpHeaders;
    header = header.append('authorization', token);
    header = header.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:8080/chat/getGroupChats', { headers: header });
  }

  getMessages(channelId) {
    let header = new HttpHeaders;
    // header = header.append('chatID', channelId);
    header = header.append('Content-Type', 'application/json');
    return this.http.get(`http://localhost:8080/chat/messages/${channelId}`, { headers: header });
  }

  NewChat() {
    this.isNewChat.next(true);
  }

  PersonalChat() {
    this.isGroupChat.next(false);
    this.isPersonalChat.next(true);
  }

  GroupChat() {
    this.isPersonalChat.next(false);
    this.isGroupChat.next(true);
  }

  showMessages() {
    this.isNewChat.next(false);
  }

  showGroupMessages() {
    this.isNewChat.next(false);
  }

  getAllConnects(userId) {
    let header = new HttpHeaders;
    header = header.append('Content-Type', 'application/json');
    return this.http.get(`http://localhost:8080/chat/getAllConnections/${userId}`, { headers: header });
  }
}
