import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { UserService } from '../user.service';
import { User } from '../user';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {

  form: FormGroup

  constructor(
    private location: Location,
    private userService: UserService,
    private router: Router,
    private readonly formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {
    this.form = this.formBuilder.group({
      email: [''],
      password: [''],
      passwordCheck: [''],
      firstName: [''],
      lastName: ['']
    });
  }

  ngOnInit(): void {
    this.checkAuth()
    //this.getUsers();
  }

  user!: User
  users: User[] = []

  @Input() firstName: string = ''
  @Input() lastName: string = ''
  @Input() email: string = ''
  @Input() password: string = ''
  @Input() passwordCheck: string = ''

  goBack(): void {
    this.location.back();
  }

  getUsers() {
    //this.userService.getUsers().subscribe((users: User[]) => this.users = users);
    return this.userService.getUsers().toPromise()
  }

  getPassword(): string {
    let stars = []
    for (let p of this.user.password) { stars.push('*') }
    return stars.join('').toString()
  }

  async checkAuth() {
    this.users = await this.getUsers()
    await this.checkUsers()
  }

  checkUsers() {
    for (let i = 0; i < this.users.length; i++) {
      console.log('users', this.users)
      if (this.users[i].authentification == true) {
        console.log('users[i]', this.users[i])

        this.user = this.users[i]
        return
      }

    } //if(this.user != undefined) { 
    this.router.navigate(['/login']);
    // } else { return false }

  }

  save() {
    if (this.form.valid) {

      console.log(this.form.getRawValue().firstName)
      console.log(this.form.getRawValue().lastName)
      console.log(this.form.getRawValue().email)
      console.log(this.form.getRawValue().password)
      console.log(this.form.getRawValue().passwordCheck)

      if (this.form.getRawValue().firstName != '') { this.user.firstName = this.form.getRawValue().firstName }
      if (this.form.getRawValue().lastName != '') { this.user.lastName = this.form.getRawValue().lastName }
      console.log('firstname: ', this.user.firstName, ' lastname: ', this.user.lastName)

      //https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
      const regexp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if (this.form.get('email')?.dirty) {
        if (this.form.getRawValue().email != '' && regexp.test(this.form.getRawValue().email)) {
          this.user.username = this.form.getRawValue().email
        } else { this.toastr.warning('The E-Mail address is not valid'); return }
      }

      if (this.form.get('password')?.dirty) {
        if (this.form.getRawValue().password != '' &&
          this.form.getRawValue().password.length >= 6 &&
          this.form.getRawValue().password === this.form.getRawValue().passwordCheck) {
          this.user.password = this.form.getRawValue().password
        } else { this.toastr.warning('Password must be a minimum of 6 charachters and must match the second entry'); return }
      }

      this.userService.updateUser(this.user).subscribe()
      this.toastr.success('Your profile has been updated')
      this.router.navigate(['/profile'])
    } else {
      this.toastr.warning('An error occured. Please try again')
    }
  }
}
