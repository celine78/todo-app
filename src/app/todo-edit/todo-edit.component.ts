import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ThemePalette } from '@angular/material/core';
import * as moment from 'moment';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute } from '@angular/router';

import { Todo } from '../todo';
import { Category } from '../todo';
import { TodoService } from '../todo.service'
import { UserService } from '../user.service';
import { User } from '../user';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

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
  todos: Todo[] = [];
  user!: User
  todo!: Todo
  public Category = Category

  constructor(
    private todoService: TodoService, 
    private router: Router, 
    private userService: UserService,
    private location: Location,
    private readonly formBuilder: FormBuilder,
    private toastr: ToastrService,
    private matFormFieldModule: MatFormFieldModule,
    private route: ActivatedRoute
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
  @Input() dueDate!: Date
  @Input() category: string = ''
  @Input() important: boolean = false
  @Input() note: string = ''

  getTodos(): void {
    this.todoService.getTodos().subscribe(todos => this.todos = todos);
  }

  ngOnInit(): void {
    this.getTodo();
    this.getTodos();
    this.getUsers();
  }

  delete(todo: Todo): void {
    this.todoService.deleteTodo(this.todo).subscribe();
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

      if(this.form.getRawValue().title != this.todo.title) { this.todo.title =  this.form.getRawValue().title}
      if(this.form.getRawValue().dueDate != this.todo.dueDate) { this.todo.dueDate =  this.form.getRawValue().dueDate}
      if(this.form.getRawValue().category != this.todo.category) { this.todo.category =  this.form.getRawValue().category}
      if(this.form.getRawValue().important != this.todo.important) { this.todo.important =  this.form.getRawValue().important}
      if(this.form.getRawValue().note != this.todo.note) { this.todo.note =  this.form.getRawValue().note}

      this.todoService.updateTodo(this.todo).subscribe();
      this.toastr.success('Your task has been updated')
      console.log('Todos after: ', this.todos)
      this.router.navigate(['/todos'])
    } else {        
      this.toastr.warning('An error occured. Please try again')
    }
  }

  getTodo(): void {
    const id = +this.route.snapshot.paramMap.get('id')!
    this.todoService.getTodo(id).subscribe(todo => this.todo = todo);
  }
}