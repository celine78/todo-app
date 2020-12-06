import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { TodoService }  from '../todo.service';
import { Todo } from '../todo';

@Component({
  selector: 'app-todo-edit',
  templateUrl: './todo-edit.component.html',
  styleUrls: ['./todo-edit.component.css']
})
export class TodoEditComponent implements OnInit {

  @Input() todo?: Todo;
  
  constructor(
    private todoService: TodoService, 
    private location: Location, 
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getTodo();
  }

  getTodo(): void {
    let id = this.route.snapshot.paramMap.get('id');
    id ? this.todoService.getTodo(+id).subscribe(todo => this.todo = todo) : console.log('');
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    this.todo ? this.todoService.updateTodo(this.todo)
      .subscribe(() => this.goBack()) : console.log('No todo to edit.');
  }


}
