import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ThemePalette } from '@angular/material/core';

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

  constructor(private todoService: TodoService, private matButtonModule: MatButtonModule, private matIconModule: MatIconModule, private router: Router, private userService: UserService) { }

  ngOnInit(): void {
    this.getUsers()
    this.getTodos();
  }

  todos: Todo[] = [];
  users: User[] = []
  user!: User

  getTodos(): void {
    this.todoService.getTodos().subscribe(todos => this.todos = todos);
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

  getUsers() {
    this.userService.getUsers().subscribe((users: User[]) => this.users = users);
  }
}
