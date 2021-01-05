import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const todos = [
      { id: 1, title: "Create JavaScript project", dueDate: 'January 1, 2021 6:20 PM', category: 'STUDY', note: 'To do before other projects.', important: false, completed: false, userId: 1},
      { id: 2, title: "Prepare for JavaScript exam", dueDate: 'January 10, 2021 9:00 PM', category: 'STUDY', note: 'To do after project.', important: true, completed: false, userId: 1},
      { id: 3, title: "Do the groceries", dueDate: 'December 3, 2020 8:00 AM', category: 'HOME', note: 'Buy vegetables and fruits.', important: false, completed: false, userId: 2},
      { id: 4, title: "Buy new jogging pants", dueDate: 'December 20, 2020 5:45 PM', category: 'HOBBY', note: '', important: false, completed: false, userId: 2},
      { id: 5, title: "Report working hours", dueDate: 'December 7, 2020 13:10 PM', category: 'WORK', note: 'Add hours of last week.', important: true, completed: false, userId: 1}
    ];
    const users = [
      // password of madams@gmail.com : password
      // password of jmay@gmail.com : secret
      { id: 1, username: 'madams@gmail.com', password: '5f4dcc3b5aa765d61d8327deb882cf99', firstName: 'Marc', lastName: 'Adams', authentification: false },
      { id: 2, username: 'jmay@gmail.com', password: '5ebe2294ecd0e0f08eab7690d2a6ee69', firstName: 'Joey', lastName: 'May', authentification: false }
    ];
    return {todos, users};
  }

  constructor() { }
}