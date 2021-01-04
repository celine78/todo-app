import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Md5 } from 'ts-md5';
import { NGXLogger } from 'ngx-logger';
import { throwError } from 'rxjs';

import { UserService } from '../user.service';
import { User } from '../user';
import { Title } from '../title'

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
    private toastr: ToastrService,
    private logger: NGXLogger
  ) {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getUsers();
  }

  users: User[] = []
  user?: User
  title!: Title
  @Input() username: string = ''
  @Input() password: string = ''

  /**
   * Getting all users in memory
   */
  getUsers(): void {
    this.userService.getUsers().subscribe((users: User[]) => this.users = users);
  }

  /**
   * Going back in history
   */
  goBack(): void {
    this.location.back();
  }

  /**
   * Loggin in a user
   */
  // source: https://medium.com/javascript-in-plain-english/reactive-forms-in-angular-10-how-to-create-a-login-form-using-reactive-forms-c979e2b86135
  login(): void {
    try {
      if (this.form.valid) {
        this.logger.info('Checking out new login')
        const username = this.form.getRawValue().username.trim()
        // simple hashing as no sentsitive data is stored
        const password = Md5.hashStr(this.form.getRawValue().password).toString()

        let userArray!: User[]
        userArray = this.users.filter(user => user.username == username && user.password == password)
        if (userArray.length != 0) {
          this.logger.debug('User found in memory')
          this.user = userArray.shift()
          this.user != undefined ? this.userService.login(this.user).subscribe() : this.logger.error('User undefined')
          this.toastr.success('Logged in successfully')
          this.router.navigate(['/todos'])
        } else {
          this.logger.debug('User not found in memory')
          let usrname = this.users.filter(user => user.username == username)
          usrname.length == 0 ?
            this.toastr.warning('Username cannot be found') :
            this.toastr.warning('Password cannot be found')
        }
      } else {
        this.toastr.warning('Please enter a username and a password')
      }
    } catch (error) {
      this.logger.error('Error : ', error)
      this.toastr.error('An error occured with the login form')
      throwError(new Error(error))
    }
  }
}
