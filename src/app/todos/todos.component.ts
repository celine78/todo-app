import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Todo } from '../todo';
import { TodoService } from '../todo.service'
import { UserService } from '../user.service';
import { User } from '../user';

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
    ) { }

  ngOnInit(): void {
    //this.getUsers()
    //this.getTodos()
    this.checkAuth()
  }

  userTodos: Todo[] = []
  todos: Todo[] = []
  users: User[] = []
  user?: User

  getTodos() {
    //this.todoService.getTodos().subscribe(todos => this.todos = todos)
    return this.todoService.getTodos().toPromise()
  }

  getUserTodos() {
    console.log('this todos', this.todos)
    console.log('this user', this.user)

    this.user ? this.userTodos = this.todos.filter(todo => todo.userId == this.user?.id) : console.log('still here')
    //return this.todos.filter(todo => todo.userId == this.user?.id)
    console.log('this user todo', this.userTodos)

  }

  add(title: string): void {
    title = title.trim();
    if (!title) { return; }
    this.todoService.addTodo({ title } as Todo).subscribe(todo => {this.todos.push(todo);});
  }
  
  delete(todo: Todo): void {
    this.userTodos = this.userTodos.filter(t => t !== todo);
    this.todoService.deleteTodo(todo).subscribe();
  }

  edit(todo: Todo): void {
    this.router ? this.router.navigate([`/todo-edit/${todo.id}`]) : console.log('No router found');
  }

  changeImp(todo: Todo): void {
    todo.important ? todo.important = false : todo.important = true
    this.todoService.updateTodo(todo).subscribe()
  }

  completed(todo: Todo): void {
    todo.completed ? todo.completed = false : todo.completed = true
    this.todoService.updateTodo(todo).subscribe()
  }

  review(todo: Todo): void {
    this.router ? this.router.navigate([`/todo-detail/${todo.id}`]) : console.log('No router found');

  }

  //https://stackblitz.com/edit/angular-async-await-eg?file=src%2Fapp%2Fapp.component.ts

  async checkAuth() {
    this.users = await this.getUsers()
    this.todos = await this.getTodos()
    await this.checkUsers()
    this.getUserTodos()


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

  /*checkAuth(): boolean {
    let users = this.users
    for(let i=0; i < users.length ;i++) {
      console.log('users', users)
      if(users[i].authentification == true) {
        console.log('users[i]', users[i])

        this.user = users[i]
        return true
      }
      
    } //if(this.user != undefined) { 
      this.router.navigate(['/login']); 
      return false 
   // } else { return false }
    
  }*/

  getUsers() {
    //this.userService.getUsers().subscribe((users: User[]) => this.users = users);
    return this.userService.getUsers().toPromise()

  }
}
