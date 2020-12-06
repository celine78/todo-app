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

  constructor(
    private todoService: TodoService, 
    private location: Location, 
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getTodo();
  }

  @Input() todo?: Todo;

  getTodo(): void {
    let id = this.route.snapshot.paramMap.get('id');
    id ? this.todoService.getTodo(+id).subscribe(todo => this.todo = todo) : console.log('');
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    this.todo ? this.todoService.updateTodo(this.todo)
      .subscribe(() => this.goBack()) : console.log('No todo to save.');
  }

}
