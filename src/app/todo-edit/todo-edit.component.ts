import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ThemePalette } from '@angular/material/core';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';

import { Todo } from '../todo';
import { Category } from '../todo';
import { TodoService } from '../todo.service'
import { UserService } from '../user.service';
import { User } from '../user';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { subscribeOn } from 'rxjs/operators';

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
    //this.getTodo()
    //this.getTodos()
    //this.getUsers()
    this.checkAuth()
  }

  delete(todo: Todo): void {
    this.todoService.deleteTodo(todo).subscribe();
  }

  async checkAuth() {
    this.users = await this.getUsers()
    this.todo = await this.getTodo()
    await this.checkUsers()
    await this.checkTodoId()

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

  checkTodoId() {
    //this.todo.userId == this.user?.id ? this.userTodo = this.todo : this.router.navigate(['/login'])
    if(this.todo.userId == this.user?.id) {
      return this.userTodo = this.todo
    } else { return this.router.navigate(['/login']) }
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
      console.log('Todos before: ', this.userTodos)

      if(this.form.getRawValue().title != '') { this.userTodo.title =  this.form.getRawValue().title }
      if(this.form.getRawValue().category != this.userTodo.category) { this.userTodo.category =  this.form.getRawValue().category}
      if(this.form.getRawValue().important != '' && this.form.getRawValue().important == 'yes') { this.userTodo.important =  true}
      if(this.form.getRawValue().important != '' && this.form.getRawValue().important == 'no') { this.userTodo.important =  false}
      if(this.form.getRawValue().note != '') { this.userTodo.note =  this.form.getRawValue().note}
      if(this.form.get('dueDate')?.dirty) {
        let newDate = this.form.getRawValue().dueDate
        let dateFormatted = moment(newDate).format('LLL')
        this.todo.dueDate =  dateFormatted
      }

      this.todoService.updateTodo(this.userTodo).subscribe();
      this.toastr.success('Your task has been updated')
      console.log('Todos after: ', this.userTodos)
      this.router.navigate(['/todos'])
    } else {        
      this.toastr.warning('An error occured. Please try again')
    }
  }

  getTodo() {
    const id = +this.route.snapshot.paramMap.get('id')!
    //this.todoService.getTodo(id).subscribe(todo => this.todo = todo);
    return this.todoService.getTodo(id).toPromise()
  }
}