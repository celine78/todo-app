import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NGXLogger } from 'ngx-logger';

import { Todo } from '../todo';
import { TodoService } from '../todo.service'
import { UserService } from '../user.service';
import { User } from '../user';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-todo-details',
  templateUrl: './todo-details.component.html',
  styleUrls: ['./todo-details.component.css']
})
export class TodoDetailsComponent implements OnInit {

  todo!: Todo;
  users: User[] = []
  user?: User
  userTodo!: Todo

  constructor(
    private todoService: TodoService,
    private router: Router,
    private userService: UserService,
    private location: Location,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private logger: NGXLogger
  ) { }

  ngOnInit(): void {
    this.checkAuth()
  }

  /**
   * Getting all users and the todo to view, checking authentication and that the todo belongs to this user
   * source: https://stackblitz.com/edit/angular-async-await-eg?file=src%2Fapp%2Fapp.component.ts
   */
  async checkAuth() {
    this.users = await this.getUsers()
    this.todo = await this.getTodo()
    await this.checkUsers()
    await this.checkTodoId()
  }

  /**
   * Getting all users from memory
   */
  getUsers() {
    return this.userService.getUsers().toPromise().catch(error => { this.logger.error(error); return [] }
    )
  }

  /**
   * Getting the todo to view
   */
  getTodo() {
    const id = +this.route.snapshot.paramMap.get('id')!
    return this.todoService.getTodo(id).toPromise().catch(error => { this.logger.error(error); return this.todo }
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
   * Checking that the todo's userid corresponds to the authenticated user
   */
  checkTodoId() {
    try {
      if (this.todo.userId == this.user?.id) {
        this.logger.info('Viewing user\'s todo : ', this.todo)
        return this.userTodo = this.todo
      } else { return this.router.navigate(['/login']) }
    } catch (error) {
      this.logger.error('Error : ', error)
      this.toastr.error('An error occured with the profil editing form')
      throwError(new Error(error))
      return null
    }
  }

  /**
   * Going back in history
   */
  goBack(): void {
    this.location.back();
  }

  /**
   * Redirecting to the todo editing component
   * @param todo The todo to edit
   */
  edit(todo: Todo) {
    this.router.navigate([`/todo-edit/${todo.id}`])
  }
}