import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ThemePalette } from '@angular/material/core';
import * as moment from 'moment';
import { MatFormFieldModule } from '@angular/material/form-field';

import { Todo } from '../todo';
import { Category } from '../todo';
import { TodoService } from '../todo.service'
import { UserService } from '../user.service';
import { User } from '../user';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-todo-details',
  templateUrl: './todo-details.component.html',
  styleUrls: ['./todo-details.component.css']
})
export class TodoDetailsComponent implements OnInit {

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
    private matFormFieldModule: MatFormFieldModule
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

  getTodos(): void {
    this.todoService.getTodos().subscribe(todos => this.todos = todos);
  }

  ngOnInit(): void {
    this.getTodos();
    this.getUsers();
  }

  add(title: string): void {
    title = title.trim();
    if (!title) { return; }
    this.todoService.addTodo({ title } as Todo)
      .subscribe(todo => {
        this.todos.push(todo);
      });
  }
  
  delete(todo: Todo): void {
    this.todos = this.todos.filter(t => t !== todo);
    this.todoService.deleteTodo(todo).subscribe();
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

  goBack(): void {
    this.location.back();
  }

  getUsers() {
    this.userService.getUsers().subscribe((users: User[]) => this.users = users);
  }

  save() {
    if (this.form.valid) {
      console.log('Todos before: ', this.todos)

      let cat: Category
      this.form.getRawValue().category == '' ? cat = Category.HOBBY : cat = this.form.getRawValue().category

      const title = this.form.getRawValue().title
      const dueDate = this.form.getRawValue().dueDate
      const important = this.form.getRawValue().important
      const note = this.form.getRawValue().note

      let todo : Todo = { id: 10, title: title, dueDate: dueDate, category: cat, important: important, 
        note: note, completed: false };

      this.todoService.addTodo(todo).subscribe((todo) => {
        this.todos.push(todo)
      });
      this.toastr.success('Your new task has been saved')
      console.log('Todos after: ', this.todos)
      this.router.navigate(['/todos'])
    } else {
      if(this.form.untouched) { this.toastr.warning('Please fill out the form') }
      else if(this.form.getRawValue().title == '') { this.toastr.warning('A title must be entered') }
      else if(this.form.getRawValue().dueDate == '') { this.toastr.warning('A due date must be choosen') }
      else if(this.form.getRawValue().important == '') { this.toastr.warning('Please choose if the task is important') }          
      else { this.toastr.warning('An error occured. Please try again') }
    }
  }
}