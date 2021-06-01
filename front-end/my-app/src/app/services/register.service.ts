import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  authToken: any;
  user: any;

  constructor(private http:HttpClient) { }

  registerUser(user)
  {
    let header = new HttpHeaders;
    header.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:8080/login/register', user, {headers: header});
  }

  getEmails()
  {
    return this.http.get('http://localhost:8080/login/getemail');
  }

  getusernames()
  {
    return this.http.get('http://localhost:8080/login/getusername');
  }
}
