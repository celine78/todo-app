import { Component, OnInit } from '@angular/core';

import { Todo } from '../todo';
import { TodoService } from '../todo.service'

@Component({
  selector: 'app-todo-add',
  templateUrl: './todo-add.component.html',
  styleUrls: ['./todo-add.component.css']
})
export class TodoAddComponent implements OnInit {

  todos: Todo[] = [];
  
  constructor(private todoService: TodoService) { }

  getTodos(): void {
    this.todoService.getTodos().subscribe(todos => this.todos = todos);
  }

  ngOnInit(): void {
    this.getTodos();
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

}
