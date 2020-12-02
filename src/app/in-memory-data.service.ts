import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Todo } from './todo';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const todos = [
      { id: 1, title: "Create JavaScript project", dueDate: '01.01.2020', category: 'STUDY', note: 'To do before other projects.', important: true, completed: false},
      { id: 2, title: "Prepare for JavaScript exam", dueDate: '10.01.2020', category: 'STUDY', note: 'To do after project.', important: true, completed: false},
      { id: 3, title: "Do the groceries", dueDate: '03.12.2020', category: 'HOME', note: 'Buy vegetables and fruits.', important: false, completed: false},
      { id: 4, title: "Buy new jogging pants", dueDate: '20.12.2020', category: 'HOBBY', note: '', important: false, completed: false},
      { id: 5, title: "Report working hours", dueDate: '07.12.2020', category: 'WORK', note: 'Add hours of last week.', important: true, completed: false}
    ];
    return {todos};
  }

  constructor() { }
}

/*
    id: number;
    title: string;
    dueDate: Date;
    category: Category;
    note: string;
    important: boolean;
    completed: boolean;
}

enum Category {
    WORK,
    STUDY,
    HOME,
    HOBBY,
    OTHER
*/