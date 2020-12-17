import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { UserService } from '../user.service';
import { User } from '../user';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  form: FormGroup

  constructor(
    private location: Location,
    private userService: UserService,
    private router: Router,
    private readonly formBuilder: FormBuilder,
    private toastr: ToastrService
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
  user!: User

  @Input() firstName: string = ''
  @Input() lastName: string = ''
  @Input() email: string = ''
  @Input() password: string = ''

  goBack(): void {
    this.location.back();
  }

  getUsers(): void {
    this.userService.getUsers().subscribe((users: User[]) => this.users = users);
  }

  save() {
    if (this.form.valid) {
      const email = this.form.getRawValue().email
      const password = this.form.getRawValue().password
      const firstName = this.form.getRawValue().firstName
      const lastName = this.form.getRawValue().lastName

      let user : User = { username: email, password: password, firstName: firstName, lastName: lastName, 
        authentification: false };

      this.userService.addUser(user).subscribe((user) => {
        this.users.push(user)
      });
      this.toastr.success('You have been successfully registered')
      this.router.navigate(['/login'])
    } else {
      if(this.form.untouched) { this.toastr.warning('Please fill out the form') }
      else if(this.form.getRawValue().firstName == '' || this.form.getRawValue().lastName == '') 
             { this.toastr.warning('First name and last name must be entered') }
      else if(this.form.get('email')?.invalid) { this.toastr.warning('Email is not a valid format') }
      else if(this.form.getRawValue().password.length < 6) { this.toastr.warning('Password must be a minimum of 6 charachters') }
      else { this.toastr.warning('An error occured. Please try again') }
    }
  }

  checkAuth(): void {
    this.users.forEach( (user) => {
      if(user.authentification === true){
        this.user = user;
        return
      } else { 
        this.router.navigate(['/login'])
      }
    })
  }
}