import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Md5 } from 'ts-md5';
import { NGXLogger } from 'ngx-logger';

import { UserService } from '../user.service';
import { User } from '../user';
import { throwError } from 'rxjs';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

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
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.getUsers();
  }

  users: User[] = []
  @Input() firstName: string = ''
  @Input() lastName: string = ''
  @Input() email: string = ''
  @Input() password: string = ''

  /**
   * Getting all users in memory
   */
  getUsers(): void {
    try {
      this.userService.getUsers().subscribe((users: User[]) => this.users = users);
    } catch (error) {
      this.logger.error('Error : ', error)
      this.toastr.error('An error occured while getting users')
      throwError(new Error(error))
    }
  }

  /**
   * Going back in history
   */
  goBack(): void {
    this.location.back();
  }

  /**
   * Saving the new user in memory
   */
  save() {
    try {
      if (this.form.valid) {
        this.logger.info('Checking register form')
        const email = this.form.getRawValue().email
        // simple hashing as no sensitive data is being stored
        const password = Md5.hashStr(this.form.getRawValue().password).toString()
        const firstName = this.form.getRawValue().firstName
        const lastName = this.form.getRawValue().lastName
  
        // create a new id for the user
        const id = this.userService.createUserId(this.users)
  
        let user : User = { id: id, username: email, password: password, firstName: firstName, lastName: lastName, 
          authentification: false };
  
        // add user in memory
        this.userService.addUser(user).subscribe((user) => {
          this.users.push(user)
        });
        this.logger.info('New user has been created')
        this.toastr.success('You have been successfully registered')
        this.logger.debug('Rerouting form registration to login')
        this.router.navigate(['/login'])
      } else {
        this.logger.error('Register form is not valid')
        if(this.form.untouched) { this.toastr.warning('Please fill out the form') }
        else if(this.form.getRawValue().firstName == '' || this.form.getRawValue().lastName == '') 
               { this.toastr.warning('First name and last name must be entered') }
        else if(this.form.get('email')?.invalid) { this.toastr.warning('Email is not a valid format') }
        else if(this.form.getRawValue().password.length < 6) { this.toastr.warning('Password must be a minimum of 6 charachters') }
        else { this.toastr.warning('An error occured. Please try again') }
      }
    } catch (error) {
      this.logger.error('Error : ', error)
      this.toastr.error('An error occured with the register form')
      throwError(new Error(error))
    }
  }
}
