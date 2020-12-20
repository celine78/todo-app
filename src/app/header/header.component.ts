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
    //this.getTodos()
    //this.getUsers()
    this.checkAuth()
  }

  dialogComponent = DialogComponent;
  dialogRef!: any;
  dialogConfig = new MatDialogConfig();
  todos: Todo[] = []
  users: User[] = []
  userTodos: Todo[] = [];
  user?: User;

  getTodos() {
    //this.todoService.getTodos().subscribe((todos: Todo[]) => this.todos = todos);
    return this.todoService.getTodos().toPromise()
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

    let id = this.userService.getAuthUser()
    let users: User[] = []
    users = this.users.filter(user => user.id == id)
    users ? this.user = users.shift() : console.log('id', id)

    console.log('user.auth', this.user)
    this.user ? this.userTodos = this.todos.filter(todo => todo.userId == this.user?.id) : console.log('still here', this.user, this.userTodos)
    console.log('userTodos', this.userTodos)
    this.userTodos.forEach( (todo) => {
      this.todoService.deleteTodo(todo).subscribe();
    })
    console.log('Todos', this.todos)

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

  getUsers() {
    //this.userService.getUsers().subscribe((users: User[]) => this.users = users);
    return this.userService.getUsers().toPromise()
  }

  getUser(id?: number): void {
    console.log('id', id)
    if(id != undefined) { this.userService.getUser(id).subscribe((user: User) => this.user = user);}
    else { this.user ? this.userService.getUser(this.user.id).subscribe((user: User) => this.user = user) : console.log('no user foun')}
  }

  async checkAuth() {
    this.users = await this.getUsers()
    this.todos = await this.getTodos()
  }

  userLogout(): void{

    let id = this.userService.getAuthUser()
    let users: User[] = []
    users = this.users.filter(user => user.id == id)
    users ? this.user = users.shift() : console.log('id', id)

    if(this.user) { 
      this.user.authentification = false;
      this.userService.logout(this.user).subscribe();
    } else {
        console.log('No user found')
      }
  }
}
