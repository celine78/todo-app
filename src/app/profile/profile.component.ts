import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { UserService } from '../user.service';
import { User } from '../user';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { StaticSymbolResolver } from '@angular/compiler';
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
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
    //this.getUsers();
    this.checkAuth()
  }

  users: User[] = []
  user!: User

  goBack(): void {
    this.location.back();
  }

  getUsers() {
    //this.userService.getUsers().subscribe((users: User[]) => this.users = users);
    return this.userService.getUsers().toPromise()
  }

  getPassword(): string{
    let stars = []
    for(let p of this.user.password) { stars.push('*') }
    return stars.join('').toString()
  }

  async checkAuth() {
    this.users = await this.getUsers()
    await this.checkUsers()
  }

  checkUsers() {
    for(let i=0; i < this.users.length ;i++) {
      console.log('users', this.users)
      if(this.users[i].authentification == true) {
        console.log('users[i]', this.users[i])

        this.user = this.users[i]
        return
      }
      
    } //if(this.user != undefined) { 
      this.router.navigate(['/login']); 
   // } else { return false }

  }

  edit(user: User): void {
    this.router ? this.router.navigate(['/profile-edit']) : console.log('No router found');
  }
}