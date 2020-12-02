import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { TodoService }  from '../todo.service';
import { Todo } from '../todo';

@Component({
  selector: 'app-todo-details',
  templateUrl: './todo-details.component.html',
  styleUrls: ['./todo-details.component.css']
})
export class TodoDetailsComponent implements OnInit {

  @Input()
  todo!: Todo;

  constructor(
    private todoService: TodoService, 
    private location: Location, 
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
  }

  getTodo(): void {
    const id = 1;
    this.todoService.getTodo(id).subscribe(todo => this.todo = todo);
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    this.todoService.updateTodo(this.todo)
      .subscribe(() => this.goBack());
  }

}
