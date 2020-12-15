import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { UserService } from '../user.service';
import { User } from '../user';
import { Title } from '../title'
import { Observable } from 'rxjs';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  form: FormGroup

  constructor(
    private location: Location, 
    private userService: UserService, 
    private router: Router, 
    private readonly formBuilder: FormBuilder,
    private toastr: ToastrService
    )
    {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.getUsers();
  }
      
  users: User[] = []
  user!: User
  title!: Title
  @Input() username: string = ''
  @Input() password: string = ''

  goBack(): void {
    this.location.back();
  }

  //https://medium.com/javascript-in-plain-english/reactive-forms-in-angular-10-how-to-create-a-login-form-using-reactive-forms-c979e2b86135
  login(): void {

    if(this.form.valid) {
      const username = this.form.getRawValue().username
      const password = this.form.getRawValue().password

      this.users.forEach((user) => {
        if(user.username === username && user.password === password) {
          this.user = user
          this.toastr.success('Logged in successfully')
          this.userService.login(this.user).subscribe()
          this.router.navigate(['/todos'])
        } else if(user.username != username && user.password != password) {
          this.toastr.warning('Username and password cannot be found')
        } else if(user.username != username) { 
          this.toastr.warning('Username cannot be found')
        } else if(user.password != password) { 
          this.toastr.warning('Password is incorrect')
        }
      })
    } else { this.toastr.warning('Email address or password are not valid') }
  }

  getUsers(): void {
    this.userService.getUsers().subscribe((users: User[]) => this.users = users);
  }
}
