import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NGXLoggerHttpServiceMock } from 'ngx-logger/testing';
import { NGXMapperServiceMock } from 'ngx-logger/testing';
import { DatePipe } from '@angular/common';
import { NGXLogger, NGXLoggerHttpService, NGXMapperService, LoggerConfig, NgxLoggerLevel } from 'ngx-logger';

import { TodoService } from './todo.service';

describe('TodoService', () => {
  let service: TodoService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule, RouterTestingModule],
      providers: [
        NGXLogger,
        { provide: NGXLoggerHttpService, useClass: NGXLoggerHttpServiceMock },
        { provide: NGXMapperService, useClass: NGXMapperServiceMock },
        { provide: LoggerConfig, useValue: { level: NgxLoggerLevel.ERROR } },
        DatePipe
      ]
    });
    service = TestBed.inject(TodoService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return observable of todos', (done: DoneFn) => {
    let mockData: any = [
      { id: 1, title: "Create JavaScript project", dueDate: 'January 1, 2021 6:20 PM', category: 'STUDY', note: 'To do before other projects.', important: false, completed: false, userId: 1},
      { id: 2, title: "Prepare for JavaScript exam", dueDate: 'January 10, 2021 9:00 PM', category: 'STUDY', note: 'To do after project.', important: true, completed: false, userId: 1},
      { id: 3, title: "Do the groceries", dueDate: 'December 3, 2020 8:00 AM', category: 'HOME', note: 'Buy vegetables and fruits.', important: false, completed: false, userId: 2},
      { id: 4, title: "Buy new jogging pants", dueDate: 'December 20, 2020 5:45 PM', category: 'HOBBY', note: '', important: false, completed: false, userId: 2},
      { id: 5, title: "Report working hours", dueDate: 'December 7, 2020 13:10 PM', category: 'WORK', note: 'Add hours of last week.', important: true, completed: false, userId: 1}
    ];    
    service.getTodos().subscribe(value => {
      expect(value.length).toEqual(mockData.length);
    });
    done()
  });

  it('should return observable of todo', (done: DoneFn) => {
    let mockData: any = [
      { id: 1, title: "Create JavaScript project", dueDate: 'January 1, 2021 6:20 PM', category: 'STUDY', note: 'To do before other projects.', important: false, completed: false, userId: 1},
      { id: 2, title: "Prepare for JavaScript exam", dueDate: 'January 10, 2021 9:00 PM', category: 'STUDY', note: 'To do after project.', important: true, completed: false, userId: 1},
      { id: 3, title: "Do the groceries", dueDate: 'December 3, 2020 8:00 AM', category: 'HOME', note: 'Buy vegetables and fruits.', important: false, completed: false, userId: 2},
      { id: 4, title: "Buy new jogging pants", dueDate: 'December 20, 2020 5:45 PM', category: 'HOBBY', note: '', important: false, completed: false, userId: 2},
      { id: 5, title: "Report working hours", dueDate: 'December 7, 2020 13:10 PM', category: 'WORK', note: 'Add hours of last week.', important: true, completed: false, userId: 1}
    ];  
    service.getTodo(mockData[0].id).subscribe(value => {
      expect(value).toEqual(mockData[0])
    })
    done();
  });

  it('should update a todo', (done: DoneFn) => {
    let mockData: any = [
      { id: 3, title: "Create JavaScript project", dueDate: 'January 1, 2021 6:20 PM', category: 'STUDY', note: 'To do before other projects.', important: false, completed: false, userId: 1}
    ];  
    service.updateTodo(mockData[0]).subscribe(value => {
      expect(value.id).toEqual(3)
    })
    done();
  });

  it('should add a todo', (done: DoneFn) => {
    let mockData: any = [
      { id: 6, title: "Create JavaScript project", dueDate: 'January 1, 2021 6:20 PM', category: 'STUDY', note: 'To do before other projects.', important: false, completed: false, userId: 1}
    ];  
    service.addTodo(mockData[0]).subscribe(value => {
      expect(value.id).toEqual(6)
    })
    done();
  });

  it('should delete a todo', (done: DoneFn) => {
    let mockData: any = [
      { id: 1, title: "Create JavaScript project", dueDate: 'January 1, 2021 6:20 PM', category: 'STUDY', note: 'To do before other projects.', important: false, completed: false, userId: 1},
      { id: 2, title: "Prepare for JavaScript exam", dueDate: 'January 10, 2021 9:00 PM', category: 'STUDY', note: 'To do after project.', important: true, completed: false, userId: 1},
      { id: 3, title: "Do the groceries", dueDate: 'December 3, 2020 8:00 AM', category: 'HOME', note: 'Buy vegetables and fruits.', important: false, completed: false, userId: 2},
      { id: 4, title: "Buy new jogging pants", dueDate: 'December 20, 2020 5:45 PM', category: 'HOBBY', note: '', important: false, completed: false, userId: 2},
      { id: 5, title: "Report working hours", dueDate: 'December 7, 2020 13:10 PM', category: 'WORK', note: 'Add hours of last week.', important: true, completed: false, userId: 1}
    ];  
    service.deleteTodo(mockData[0]).subscribe(value => {
      expect(value.id).toEqual(1)
    })
    done();
  });

  it('should create a todo id', () => {
    let mockData: any = [
      { id: 1, title: "Create JavaScript project", dueDate: 'January 1, 2021 6:20 PM', category: 'STUDY', note: 'To do before other projects.', important: false, completed: false, userId: 1},
      { id: 2, title: "Prepare for JavaScript exam", dueDate: 'January 10, 2021 9:00 PM', category: 'STUDY', note: 'To do after project.', important: true, completed: false, userId: 1},
      { id: 3, title: "Do the groceries", dueDate: 'December 3, 2020 8:00 AM', category: 'HOME', note: 'Buy vegetables and fruits.', important: false, completed: false, userId: 2},
      { id: 4, title: "Buy new jogging pants", dueDate: 'December 20, 2020 5:45 PM', category: 'HOBBY', note: '', important: false, completed: false, userId: 2},
      { id: 5, title: "Report working hours", dueDate: 'December 7, 2020 13:10 PM', category: 'WORK', note: 'Add hours of last week.', important: true, completed: false, userId: 1}
    ];  
    let id = service.createTodoId(mockData)
    expect(id).toEqual(6);
  });
});
