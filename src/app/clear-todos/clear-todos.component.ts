import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NGXLogger } from 'ngx-logger';
import { throwError } from 'rxjs';

import { UserService } from '../user.service';
import { TodoService } from '../todo.service';
import { Todo } from '../todo';
import { User } from '../user';

@Component({
  selector: 'app-clear-todos',
  templateUrl: './clear-todos.component.html',
  styleUrls: ['./clear-todos.component.css']
})
export class ClearTodosComponent implements OnInit {

  constructor(
    private router: Router,
    private userService: UserService,
    private todoService: TodoService,
    private toastr: ToastrService,
    private logger: NGXLogger
  ) { }

  ngOnInit(): void {
    this.clearAll()
  }

  todos: Todo[] = []
  users: User[] = []
  userTodos: Todo[] = [];
  user?: User;
  checkLogin: boolean = false

  /**
   * Getting all users and todo in memory, checking authentication and deleting todos
   * source: https://stackblitz.com/edit/angular-async-await-eg?file=src%2Fapp%2Fapp.component.ts
   */
  async clearAll() {
    this.users = await this.userService.getUsers().toPromise()
    this.todos = await this.todoService.getTodos().toPromise()
    this.checkLogin = await this.checkUsers()
    this.deleteTodos()
  }

  /**
   * Checking the authenticated user
   */
  checkUsers(): boolean {
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].authentification == true) {
        this.logger.debug('Authentificated user : ', this.users[i])
        this.user = this.users[i]
        return true
      }
    }
    this.logger.info('No user authentificated')
    return false
  }

  /**
   * Deleting all todos of a authenticated user
   */
  deleteTodos(): void {
    // if user is logged in
    if (this.checkLogin) {
      this.logger.info('Deleting all todos for user : ', this.user)
      try {
        // getting all todos of the authenticated user
        this.userTodos = this.todos.filter(todo => todo.userId == this.user?.id)
      } catch (error) {
        this.logger.error('Error : ', error)
        this.toastr.error('An error occured while getting your todos')
        throwError(new Error(error))
      }
      try {
        // deleting in memory
        this.userTodos.forEach((todo) => {
          this.todoService.deleteTodo(todo).subscribe();
        })
      } catch (error) {
        this.logger.error('Error : ', error)
        this.toastr.error('An error occured while deleting your todos')
        throwError(new Error(error))
      }
      this.logger.debug('Rerouting from clear-todos to todos')
      this.router.navigate(['/todos']);
    } else {
      this.toastr.info('Please login to continue')
      this.router.navigate(['/login']);
    }
  }
}