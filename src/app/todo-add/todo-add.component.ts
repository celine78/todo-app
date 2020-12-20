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

  getTodos() {
    //this.todoService.getTodos().subscribe(todos => this.todos = todos);
    return this.todoService.getTodos().toPromise()
  }

  ngOnInit(): void {
    //this.getTodos();
    //this.getUsers();
    this.checkAuth()
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

  async checkAuth() {
    this.users = await this.getUsers()
    this.todos = await this.getTodos()
    await this.checkUsers()
  }

  checkUsers() {
    for(let i=0; i < this.users.length ;i++) {
      console.log('users', this.users)
      if(this.users[i].authentification == true) {
        console.log('users[i]', this.users[i])

        this.user = this.users[i]
        return
      }
      
    } //if(this.user != undefined) { 
      this.router.navigate(['/login']); 
   // } else { return false }

  }

  goBack(): void {
    this.location.back();
  }

  getUsers() {
    //this.userService.getUsers().subscribe((users: User[]) => this.users = users);
    return this.userService.getUsers().toPromise()
  }

  save() {
    if (this.form.valid) {
      console.log('Todos before: ', this.todos)

      let cat: Category
      this.form.getRawValue().category == '' ? cat = Category.HOBBY : cat = this.form.getRawValue().category

      let newDate = this.form.getRawValue().dueDate
      let dateFormatted = moment(newDate).format('LLL')
      const dueDate =  dateFormatted

      let important: boolean
      this.form.getRawValue().important == 'yes' ? important = true : important =  false    
      
      const title = this.form.getRawValue().title
      const note = this.form.getRawValue().note

      const id = this.todoService.createTodoId(this.todos)

      let todo : Todo = { id: id, title: title, dueDate: dueDate, category: cat, important: important, 
        note: note, completed: false, userId: this.user.id};

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
