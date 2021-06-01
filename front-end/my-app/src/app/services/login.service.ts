import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { ChatService } from '../chat/services/chat.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  authToken: any;
  user: String;
  isloggedIn = new Subject<boolean>();

  constructor(private http: HttpClient, private chatService: ChatService) { }

  login(user) {
    let header = new HttpHeaders;
    header = header.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:8080/login/login', user, { headers: header });
  }

  getProfile() {
    this.getToket();
    let header = new HttpHeaders;
    header = header.append('authorization', this.authToken);
    header = header.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:8080/login/profile', { headers: header });
  }

  getToket() {
    var token = this.getCookie('id_token');
    this.authToken = token;
  }

  setToken(user, token, rememberME) {
    var expire = "";
    var date = new Date();
    date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));
    if (rememberME) {
      expire = "expires = " + date.toUTCString()
    }

    var userid = "user = " + user.id + "; " + expire + ";path=/";
    var cookie = "id_token = " + token + "; " + expire + "; path=/";
    document.cookie = cookie;
    document.cookie = userid;

    // localStorage.setItem('id_token', token);
    // localStorage.setItem('user', JSON.stringify(user));

    this.authToken = token;
    this.user = user;
  }

  logOut() {

    this.authToken = null;
    this.user = null;

    var expire = "";
    var date = new Date();
    date.setTime(date.getTime() + (-1 * 24 * 60 * 60 * 1000));
    expire = "expires = " + date.toUTCString()

    var cookie = "id_token = " + this.authToken + "; " + expire + "; path=/";
    document.cookie = cookie;
    this.chatService.emit("left", "Left...");
  }

  loggedIn() {
    var token = this.getCookie('id_token');
    if (token) {
      return true;
    }
    else {
      return false;
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
}
