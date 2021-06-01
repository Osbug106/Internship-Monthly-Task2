import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client'


@Injectable({
  providedIn: 'root'
})
export class ChatService {
  url = "ws://localhost:8080";
  socket: Socket;

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

  getMessages(channelId) {
    let header = new HttpHeaders;
    // header = header.append('chatID', channelId);
    header = header.append('Content-Type', 'application/json');
    return this.http.get(`http://localhost:8080/chat/messages/${channelId}`, { headers: header });
  }
}
