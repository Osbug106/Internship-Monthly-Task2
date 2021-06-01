import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, NgForm, Validators, FormArray } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { ChatService } from 'src/app/chat/services/chat.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router, private loginService: LoginService, private chatService: ChatService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9_]{3,}@[a-zA-Z]{3,}\.[a-zA-Z]{2,}$')]),
      password: new FormControl('', [Validators.required,]),
      checkbox: new FormControl(''),
    })
  }

  onSubmit() {
    if (this.form.valid) {
      const User = this.form.value;

      this.loginService.login(User)
        .subscribe((data: any) => {
          if (data.success) {
            // console.log('Logged in', data);
            this.loginService.loggedIn();
            this.loginService.setToken(data.user, data.token, User.checkbox);
            this.router.navigate(['/']);
          }
          else {
            console.log('Not Logged in', data.success, data.msg);
            this.router.navigate(['/login']);
          }
        }, error => {
          console.log("Error at Onsubmit login: ", error);
        }, () => {
          // console.log("Complete.");
        })

      this.form.reset();
    }
    else {
      console.log("Not Valid.");
    }
  }

}
