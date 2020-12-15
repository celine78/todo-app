import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../user.service';
import { User } from '../user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit(): void {
    this.getUsers();
  }

  users: User[] = []
  user!: User

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

  getUsers() {
    this.userService.getUsers().subscribe((users: User[]) => this.users = users);
  }
}
