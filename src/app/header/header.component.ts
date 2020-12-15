import { Component, OnInit } from '@angular/core';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { DialogComponent } from '../dialog/dialog.component';
import { TodoService } from '../todo.service';
import { UserService } from '../user.service';
import { Todo } from '../todo';
import { User } from '../user';
import { ThisReceiver } from '@angular/compiler';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    private dialog: MatDialog, 
    private todoService: TodoService, 
    private router: Router, 
    private userService: UserService,
    private toastr: ToastrService
    ) { }

  ngOnInit(): void {
    this.getTodos()
    this.getUsers()
    this.checkAuth()
  }

  dialogComponent = DialogComponent;
  dialogRef!: any;
  dialogConfig = new MatDialogConfig();
  todos: Todo[] = []
  users: User[] = []
  user!: User;
  status: string = 'Login'

  getTodos(): void {
    this.todoService.getTodos().subscribe((todos: Todo[]) => this.todos = todos);
  }
  

  clear(): void {
    this.dialogRef = this.dialog ? this.dialog.open(DialogComponent, {
      data: {
            title: 'Clear Todo\'s',
            body: 'Are you sure that you want to delete all your todo\'s ?',
            btnTextLeft: 'Cancel',
            btnTextRight: 'Delete',
      }
    }) :

    //calling the variable
    //https://stackblitz.com/edit/mat-dialog-example?file=app%2Fapp.component.ts
    this.dialogRef = this.dialogRef

    this.dialogRef.afterClosed().subscribe((accepted: boolean) => {
      if(accepted) { 
        this.deleteTodos()
        this.router.navigate(['/waiting'])
      } else { console.log('Did not clear all todos.') }
    });
  }

  deleteTodos(): void {
    this.todos.forEach( (todo) => {
      this.todoService.deleteTodo(todo).subscribe();
    })
  }

  logout(): void{
    this.dialogRef = this.dialog ? this.dialog.open(DialogComponent, {
      data: {
            title: 'Logout',
            body: 'Are you sure that you want to logout ?',
            btnTextLeft: 'Cancel',
            btnTextRight: 'Logout',
      }
    }) :

    //calling the variable
    //https://stackblitz.com/edit/mat-dialog-example?file=app%2Fapp.component.ts
    this.dialogRef = this.dialogRef

    this.dialogRef.afterClosed().subscribe((accepted: boolean) => {
      if(accepted) { 
        this.userLogout()
        this.toastr.info('Logging out')
        this.router.navigate(['/logout'])
      } else { console.log('Did not logout.') }
    });
  }

  getUsers(): void {
    this.userService.getUsers().subscribe((users: User[]) => this.users = users);
  }

  getUser(): void {
    this.userService.getUser(this.user.id!).subscribe((user: User) => this.user = user);
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

  /*requiredAuth(): void {
    this.status = this.userService.getAuth(this.user)
    
  }*/

  userLogout(): void{
    console.log('Logout users: ', this.users)
    this.users.forEach( (user) => {
      if(user.authentification === true){
        this.user = user;
        console.log('Logout user: ', user)
        this.user.authentification = false
        this.userService.logout(this.user).subscribe();
      } else {
        console.log('Already logged out')
      }
    })
  }

  //this.user != null || this.user != undefined ? this.router.navigate(['/todos']) : this.router.navigate(['/login'])
}
