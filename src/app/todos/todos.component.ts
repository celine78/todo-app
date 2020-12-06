import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

import { Todo } from '../todo';
import { TodoService } from '../todo.service'

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css']
})
export class TodosComponent implements OnInit {

  constructor(private todoService: TodoService, private matButtonModule: MatButtonModule, private matIconModule: MatIconModule, private router: Router) { }

  ngOnInit(): void {
    this.getTodos();
  }

  todos: Todo[] = [];

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
    todo.important ? todo.important = false : todo.important = true;
  }
}
