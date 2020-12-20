import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { Todo } from '../todo';
import { TodoService } from '../todo.service'
import { UserService } from '../user.service';
import { User } from '../user';
import { ToastrService } from 'ngx-toastr';

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
    ) { }

  ngOnInit(): void {
    //this.getTodo();
    //this.getUsers();
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
    //this.user != undefined && this.todo.userId == this.user.id ? this.userTodo = this.todo : console.log('cannot check id with user. user: ', this.user, 'this.todo.userId', this.todo.userId) //this.router.navigate(['/login'])
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

  getTodo() {
    const id = +this.route.snapshot.paramMap.get('id')!
    //this.todoService.getTodo(id).subscribe(todo => this.todo = todo);
    return this.todoService.getTodo(id).toPromise()
  }

  edit(todo: Todo) {
    this.router ? this.router.navigate([`/todo-edit/${todo.id}`]) : console.log('No router found');

  }
}