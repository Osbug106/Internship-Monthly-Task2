import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, NgForm, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterService } from 'src/app/services/register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  submitted: boolean = false;

  constructor(private formBuilder: FormBuilder, private registerService: RegisterService, private router: Router) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      fname: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]{3,20}$')]),
      lname: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]{3,20}$')]),
      email: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9_]{3,}@[a-zA-Z]{3,}\.[a-zA-Z]{2,}$')], this.checkEmail.bind(this)),
      phone: new FormControl('', [Validators.required, Validators.pattern('^(03|\\+923)[0-4][0-9]{8}$')]),
      username: new FormControl('', [Validators.required], this.checkUserName.bind(this)),
      password: new FormControl('', [Validators.required, , Validators.pattern('^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$')]),

      checkbox: new FormControl(false, Validators.requiredTrue)
    });
  }


  checkUserName(control: FormControl): Promise<any> {
    let usernames: any = [];

    this.registerService.getusernames()
      .subscribe(data => {
        for (let username in data) {
          usernames.push(data[username].username);
          // console.log(usernames);
        }
      }, error => {
        console.log("Error in checkUserName: ", error);
      }, () => {
        // console.log("Complete.");
      })

    const response = new Promise<any>((res, rej) => {
      setTimeout(() => {
        if (usernames.indexOf(control.value) !== -1) {
          res({ notAvailable: true });
        }
        else {
          res(null);
        }
      }, 1000);
    });
    return response;
  }

  checkEmail(control: FormControl): Promise<any> {
    let userEmails: any = [];

    this.registerService.getEmails()
      .subscribe(data => {
        for (let email in data) {
          userEmails.push(data[email].email);
        }
      }, error => {
        console.log("Error in getEmails: ", error);
      }, () => {
        // console.log("Complete.");
      })


    const response = new Promise<any>((res, rej) => {
      setTimeout(() => {
        if (userEmails.indexOf(control.value) !== -1) {
          res({ notAvailable: true });
        }
        else {
          res(null);
        }
      }, 1000);
    });
    return response;
  }

  onSubmit() {
    if (this.form.status == "VALID") {
      let newUser = this.form.value;
      // console.log(newUser);
      this.registerService.registerUser(newUser)
        .subscribe(
          (data: any) => {
            if (data.success) {
              console.log("Registered.", data.success);
            } else {
              console.log("Not Registered.", data.success, data.msg);
            }
          }, error => {
            console.log("Error at registerUser: ", error);
          }, () => {
            console.log("Complete.");
          });

      // console.log("Form Submitted.");
      this.form.reset();
      this.router.navigate(['/login']);
    }
    else {
      // console.log(this.form);
      this.submitted = false;
      console.log("Form Not Submitted.. !");
    }
  }

}
