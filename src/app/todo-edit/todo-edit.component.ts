import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ThemePalette } from '@angular/material/core';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NGXLogger } from 'ngx-logger';

import { Todo } from '../todo';
import { Category } from '../todo';
import { TodoService } from '../todo.service'
import { UserService } from '../user.service';
import { User } from '../user';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-todo-edit',
  templateUrl: './todo-edit.component.html',
  styleUrls: ['./todo-edit.component.css']
})
export class TodoEditComponent implements OnInit {

  form: FormGroup
  @ViewChild('picker') picker: any;

  public showSpinners = true;
  public stepHour = 1;
  public stepMinute = 1;
  public touchUi = false;
  public color: ThemePalette = 'primary';

  users: User[] = [];
  user?: User
  todo!: Todo
  userTodo!: Todo
  userTodos: Todo[] = []
  public Category = Category

  constructor(
    private todoService: TodoService,
    private router: Router,
    private userService: UserService,
    private location: Location,
    private readonly formBuilder: FormBuilder,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private logger: NGXLogger
  ) {
    this.form = this.formBuilder.group({
      title: [''],
      dueDate: [''],
      category: [''],
      important: [''],
      note: [''],
    });
  }

  @Input() title: string = ''
  @Input() dueDate: string = ''
  @Input() category: string = ''
  @Input() important: boolean = false
  @Input() note: string = ''

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
        this.logger.info('Editing user\'s todo : ', this.todo)
        return this.userTodo = this.todo
      } else { return this.router.navigate(['/login']) }
    } catch (error) {
      this.logger.error('Error : ', error)
      this.toastr.error('You may not have the permission to access this todo or the id does not exist')
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
   * Saving the changes for a todo
   */
  save() {
    try {
      if (this.form.valid) {
        this.logger.info('Checking todo edit form')
        if (this.form.getRawValue().title != '') { this.userTodo.title = this.form.getRawValue().title }
        if (this.form.getRawValue().category != this.userTodo.category) { this.userTodo.category = this.form.getRawValue().category }
        if (this.form.getRawValue().important != '' && this.form.getRawValue().important == 'yes') { this.userTodo.important = true }
        if (this.form.getRawValue().important != '' && this.form.getRawValue().important == 'no') { this.userTodo.important = false }
        if (this.form.getRawValue().note != '') { this.userTodo.note = this.form.getRawValue().note }
        // if due date has been changed
        if (this.form.get('dueDate')?.dirty) {
          let newDate = this.form.getRawValue().dueDate
          let dateFormatted = moment(newDate).format('LLL')
          this.todo.dueDate = dateFormatted
        }
        this.logger.info('Todo edit form validated')
        // update todo in memory
        this.todoService.updateTodo(this.userTodo).subscribe();
        this.logger.info('Todo updated : ', this.userTodo)
        this.toastr.success('Your task has been updated')
        this.router.navigate(['/todos'])
      } else {
        this.logger.warn('Todo edit form is not valid')
        this.toastr.warning('An error occured. Please try again')
      }
    } catch (error) {
      this.logger.error('Error : ', error)
      this.toastr.error('An error occured with the todo editing form')
      throwError(new Error(error))
    }
  }

  /**
   * Deleting a todo in memory
   * @param todo A todo to delete
   */
  delete(todo: Todo): void {
    try {
      this.todoService.deleteTodo(todo).subscribe()
      this.toastr.success('Todo deleted successfully')
      this.logger.info('Todo deleted : ', todo.title)
      this.router.navigate(['/todos'])
    } catch (error) {
      this.logger.error('Error : ', error)
      this.toastr.error('An error occured while deleting the todo ', todo.title)
      throwError(new Error(error))
    }
  }
}