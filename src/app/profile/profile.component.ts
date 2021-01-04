import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NGXLogger } from 'ngx-logger';

import { UserService } from '../user.service';
import { User } from '../user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(
    private location: Location,
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService,
    private logger: NGXLogger
  ) {
  }

  ngOnInit(): void {
    this.checkAuth()
  }

  users: User[] = []
  user!: User

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
   * Redirecting to the profil editing component
   */
  edit(): void {
    this.router.navigate(['/profile-edit'])
  }
}