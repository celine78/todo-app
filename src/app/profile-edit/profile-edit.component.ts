import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Md5 } from 'ts-md5/dist/md5';
import { NGXLogger } from 'ngx-logger';

import { UserService } from '../user.service';
import { User } from '../user';
import { throwError } from 'rxjs';

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
    private toastr: ToastrService,
    private logger: NGXLogger
  ) {
    this.form = this.formBuilder.group({
      email: [''],
      passwordNew: [''],
      passwordCheck: [''],
      firstName: [''],
      lastName: ['']
    });
  }

  ngOnInit(): void {
    this.checkAuth()
  }

  user!: User
  users: User[] = []

  @Input() firstName: string = ''
  @Input() lastName: string = ''
  @Input() email: string = ''
  @Input() passwordNew: string = ''
  @Input() passwordCheck: string = ''

  /**
   * Getting all users and check that a user is authenticated
   * source: https://stackblitz.com/edit/angular-async-await-eg?file=src%2Fapp%2Fapp.component.ts
   */
  async checkAuth() {
    this.users = await this.getUsers()
    await this.checkUsers()
  }

  /**
   * Getting all users in memory
   */
  getUsers() {
    return this.userService.getUsers().toPromise().catch(error => { this.logger.error(error); return [] }
    )
  }

  /**
   * Getting the authenticated user
   */
  checkUsers() {
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].authentification == true) {
        this.logger.debug('Authentificated user : ', this.users[i])
        this.user = this.users[i]
        return
      }
      this.logger.info('No user authentificated')
    }
    this.toastr.info('Please login to continue')
    this.router.navigate(['/login']);
  }

  /**
   * Going back in history
   */
  goBack(): void {
    this.location.back();
  }

  /**
   * Hidding the password in the frontend with stars
   */
  getPassword(): string {
    let stars = []
    for (let p of this.user.password) { stars.push('*') }
    return stars.join('').toString()
  }

  /**
   * Saving profile changes of user
   */
  save() {
    try {
      if (this.form.valid) {
        this.logger.info('Checking out profil editing form')
        if (this.form.getRawValue().firstName != '') { this.user.firstName = this.form.getRawValue().firstName.trim() }
        if (this.form.getRawValue().lastName != '') { this.user.lastName = this.form.getRawValue().lastName.trim() }
        this.logger.info('First and last name validated')

        // source: https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
        const regexp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        // if the email has been changed
        if (this.form.get('email')?.dirty) {
          // check if valid email
          if (this.form.getRawValue().email != '' && regexp.test(this.form.getRawValue().email.trim())) {
            this.user.username = this.form.getRawValue().email.trim()
            this.logger.info('Email validated')
          } else { this.toastr.warning('The E-Mail address is not valid'); return }
        }

        // if password had been changed
        if (this.form.get('passwordNew')?.dirty) {
          if (this.form.getRawValue().passwordNew != '' &&
            this.form.getRawValue().passwordNew.length >= 6 &&
            this.form.getRawValue().passwordNew === this.form.getRawValue().passwordCheck) {
            const hashedPassword = Md5.hashStr(this.form.getRawValue().passwordNew)
            this.user.password = hashedPassword.toString()
            this.logger.info('Password verified and hashed')
          } else { this.toastr.warning('Password must be a minimum of 6 charachters and must match the second entry'); return }
        }

        // update user in memory
        this.userService.updateUser(this.user).subscribe()
        this.logger.info('User profile updated in memory')
        this.toastr.success('Your profile has been updated')
        this.router.navigate(['/profile'])
      } else {
        this.logger.error('Profile editng form is not valid')
        this.toastr.warning('An error occured. Please try again')
      }
    } catch (error) {
      this.logger.error('Error : ', error)
      this.toastr.error('An error occured with the profil editing form')
      throwError(new Error(error))
    }
  }
}
