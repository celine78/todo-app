import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ThemePalette } from '@angular/material/core';
import * as moment from 'moment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NGXLogger } from 'ngx-logger';

import { Todo } from '../todo';
import { Category } from '../todo';
import { TodoService } from '../todo.service'
import { UserService } from '../user.service';
import { User } from '../user';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-todo-add',
  templateUrl: './todo-add.component.html',
  styleUrls: ['./todo-add.component.css']
})
export class TodoAddComponent implements OnInit {

  form: FormGroup
  @ViewChild('picker') picker: any;

  public date!: moment.Moment;
  public showSpinners = true;
  public minDate!: moment.Moment;
  public maxDate!: moment.Moment;
  public stepHour = 1;
  public stepMinute = 1;
  public touchUi = false;
  public color: ThemePalette = 'primary';

  todos: Todo[] = [];
  users: User[] = []
  user!: User
  public Category = Category

  constructor(
    private todoService: TodoService,
    private router: Router,
    private userService: UserService,
    private location: Location,
    private readonly formBuilder: FormBuilder,
    private toastr: ToastrService,
    private logger: NGXLogger
  ) {
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      dueDate: ['', Validators.required],
      category: [''],
      important: ['', Validators.required],
      note: [''],
    });
  }

  @Input() title: string = ''
  @Input() dueDate!: Date
  @Input() category: string = ''
  @Input() important: boolean = false
  @Input() note: string = ''

  ngOnInit(): void {
    this.checkAuth()
  }

  /**
   * Getting all todos, users and checking authentification
   * source: https://stackblitz.com/edit/angular-async-await-eg?file=src%2Fapp%2Fapp.component.ts
   */
  async checkAuth() {
    this.users = await this.getUsers()
    this.todos = await this.getTodos()
    await this.checkUsers()
  }

  /**
   * Getting all users
   */
  getUsers() {
    return this.userService.getUsers().toPromise().catch(error => { this.logger.error(error); return [] }
    )
  }

  /**
   * Getting all todos
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
   * Going back in history
   */
  goBack(): void {
    this.location.back();
  }

  /**
   * Saving the new todo
   */
  save() {
    try {
      if (this.form.valid) {
        this.logger.debug('Checking out add todo form')

        let cat: Category
        // if no category chosen, default is HOBBY
        this.form.getRawValue().category == '' ? cat = Category.HOBBY : cat = this.form.getRawValue().category
        this.logger.debug('Todo category validated')

        let newDate = this.form.getRawValue().dueDate
        let dateFormatted = moment(newDate).format('LLL')
        const dueDate = dateFormatted
        this.logger.debug('Todo due date validated')


        let important: boolean
        this.form.getRawValue().important == 'yes' ? important = true : important = false
        this.logger.debug('Todo importance validated')

        const title = this.form.getRawValue().title
        this.logger.debug('Todo title validated')
        const note = this.form.getRawValue().note
        this.logger.debug('Todo note validated')

        // create new id for the todo
        const id = this.todoService.createTodoId(this.todos)
        this.logger.debug('Todo id created : ', id)

        let todo: Todo = {
          id: id, title: title, dueDate: dueDate, category: cat, important: important,
          note: note, completed: false, userId: this.user.id
        };
        this.logger.info('Todo created : ', todo)

        // adding todo in memory
        this.todoService.addTodo(todo).subscribe((todo) => {
          this.todos.push(todo)
        });
        this.logger.info('Todo added : ', this.todos)
        this.toastr.success('Your new task has been saved')
        this.router.navigate(['/todos'])
      } else {
        this.logger.warn('Add todo form not valid')
        if (this.form.untouched) { this.toastr.warning('Please fill out the form') }
        else if (this.form.getRawValue().title == '') { this.toastr.warning('A title must be entered') }
        else if (this.form.getRawValue().dueDate == '') { this.toastr.warning('A due date must be chosen') }
        else if (this.form.getRawValue().important == '') { this.toastr.warning('Please choose if the task is important') }
        else { this.toastr.warning('An error occured. Please try again'); this.logger.error('An error occured on the add todo form') }
      }
    } catch (error) {
      this.logger.error('Error : ', error)
      this.toastr.error('An error occured with the profil editing form')
      throwError(new Error(error))
    }
  }
}
