import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NGXLogger } from 'ngx-logger';

import { Todo } from '../todo';
import { TodoService } from '../todo.service'
import { UserService } from '../user.service';
import { User } from '../user';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css']
})
export class TodosComponent implements OnInit {

  constructor(
    private todoService: TodoService,
    private router: Router,
    private userService: UserService,
    private toastr: ToastrService,
    private logger: NGXLogger
  ) { }

  ngOnInit(): void {
    this.checkAuth()
  }

  userTodos: Todo[] = []
  todos: Todo[] = []
  users: User[] = []
  user?: User

  /**
   * Getting all users and todos, checking authentication and filtering the users todo's
   * source: https://stackblitz.com/edit/angular-async-await-eg?file=src%2Fapp%2Fapp.component.ts
   */
  async checkAuth() {
    this.users = await this.getUsers()
    this.todos = await this.getTodos()
    await this.checkUsers()
    this.getUserTodos()
  }

  /**
   * Getting all users in memory
   */
  getUsers() {
    return this.userService.getUsers().toPromise().catch(error => { this.logger.error(error); return [] }
    )
  }

  /**
   * Getting all users from memory
   */
  getTodos() {
    return this.todoService.getTodos().toPromise().catch(error => { this.logger.error(error); return [] }
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
   * Getting a user's todos
   */
  getUserTodos() {
    this.userTodos = this.todos.filter(todo => todo.userId == this.user?.id)
    this.logger.info('User todos : ', this.userTodos)
  }

  /**
   * Deleting a todo
   * @param todo A todo to delete
   */
  delete(todo: Todo): void {
    try {
      // deleting the todo from the user's todo array
      this.userTodos = this.userTodos.filter(t => t !== todo)
      // deleting in memory
      this.todoService.deleteTodo(todo).subscribe()
      this.logger.info('Todo deleted : ', todo.title)
      this.toastr.success('Todo deleted successfully')
    } catch (error) {
      this.logger.error('Error : ', error)
      this.toastr.error('An error occured with the todo editing form')
      throwError(new Error(error))
    }
  }

  /**
   * Redirecting to the todo editing component
   * @param todo A todo to edit
   */
  edit(todo: Todo): void {
    this.router.navigate([`/todo-edit/${todo.id}`])
  }

  /**
   * Changing the todo's importance
   * @param todo A todo to update
   */
  changeImp(todo: Todo): void {
    try {
      todo.important ? todo.important = false : todo.important = true
      this.todoService.updateTodo(todo).subscribe()
    } catch (error) {
      this.logger.error('Error : ', error)
      this.toastr.error('An error occured with the todo editing form')
      throwError(new Error(error))
    }
  }

  /**
   * Mark a todo as completed
   * @param todo A todo to update
   */
  completed(todo: Todo): void {
    try {
      todo.completed ? todo.completed = false : todo.completed = true
      this.todoService.updateTodo(todo).subscribe()
    } catch (error) {
      this.logger.error('Error : ', error)
      this.toastr.error('An error occured with the todo editing form')
      throwError(new Error(error))
    }
  }

  /**
   * Redericting to the todo viewing component
   * @param todo A todo to review
   */
  review(todo: Todo): void {
    this.router.navigate([`/todo-detail/${todo.id}`])
  }
}
