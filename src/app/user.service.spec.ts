import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NGXLoggerHttpServiceMock } from 'ngx-logger/testing';
import { NGXMapperServiceMock } from 'ngx-logger/testing';
import { DatePipe } from '@angular/common';
import { NGXLogger, NGXLoggerHttpService, NGXMapperService, LoggerConfig, NgxLoggerLevel } from 'ngx-logger';

import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
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
    service = TestBed.inject(UserService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return observable of users', (done: DoneFn) => {
    let mockData: any = [
      { id: 1, username: 'madams@gmail.com', password: '5f4dcc3b5aa765d61d8327deb882cf99', firstName: 'Marc', lastName: 'Adams', authentification: false },
      { id: 2, username: 'amyb@gmail.com', password: '5ebe2294ecd0e0f08eab7690d2a6ee69', firstName: 'Amy', lastName: 'Brown', authentification: false },
    ]    
    service.getUsers().subscribe(value => {
      expect(value.length).toEqual(mockData.length);
    });
    done()
  });

  it('should return observable of user', (done: DoneFn) => {
    let mockData: any = [
      { id: 1, username: 'madams@gmail.com', password: '5f4dcc3b5aa765d61d8327deb882cf99', firstName: 'Marc', lastName: 'Adams', authentification: false },
      { id: 2, username: 'amyb@gmail.com', password: '5ebe2294ecd0e0f08eab7690d2a6ee69', firstName: 'Amy', lastName: 'Brown', authentification: false },
    ]
    service.getUser(mockData[0].id).subscribe(value => {
      expect(value).toEqual(mockData[0])
    })
    done();
  });

  it('should update a user', (done: DoneFn) => {
    let mockData: any = [
      { id: 3, username: 'madams@gmail.com', password: '5f4dcc3b5aa765d61d8327deb882cf99', firstName: 'Marc', lastName: 'Adams', authentification: false },
      { id: 2, username: 'amyb@gmail.com', password: '5ebe2294ecd0e0f08eab7690d2a6ee69', firstName: 'Amy', lastName: 'Brown', authentification: false },
    ]
    service.updateUser(mockData[0]).subscribe(value => {
      expect(value.id).toEqual(3)
    })
    done();
  });

  it('should add a user', (done: DoneFn) => {
    let mockData: any = [
      { id: 4, username: 'jw@gmail.com', password: '5f4dcc3b5aa765d61d8327deb882cf99', firstName: 'James', lastName: 'Wood', authentification: false },
    ]
    service.addUser(mockData[0]).subscribe(value => {
      expect(value.id).toEqual(4)
    })
    done();
  });

  it('should delete a user', (done: DoneFn) => {
    let mockData: any = [
      { id: 1, username: 'madams@gmail.com', password: '5f4dcc3b5aa765d61d8327deb882cf99', firstName: 'Marc', lastName: 'Adams', authentification: false },
      { id: 2, username: 'amyb@gmail.com', password: '5ebe2294ecd0e0f08eab7690d2a6ee69', firstName: 'Amy', lastName: 'Brown', authentification: false },
    ]
    service.deleteUser(mockData[0]).subscribe(value => {
      expect(value.id).toEqual(1)
    })
    done();
  });

  it('should create a user id', () => {
    let mockData: any = [
      { id: 1, username: 'madams@gmail.com', password: '5f4dcc3b5aa765d61d8327deb882cf99', firstName: 'Marc', lastName: 'Adams', authentification: false },
      { id: 2, username: 'amyb@gmail.com', password: '5ebe2294ecd0e0f08eab7690d2a6ee69', firstName: 'Amy', lastName: 'Brown', authentification: false },
    ]
    let id = service.createUserId(mockData)
    expect(id).toEqual(3);
  });

  it('should login a user', () => {
    let mockData: any = [
      { id: 1, username: 'madams@gmail.com', password: '5f4dcc3b5aa765d61d8327deb882cf99', firstName: 'Marc', lastName: 'Adams', authentification: false },
      { id: 2, username: 'amyb@gmail.com', password: '5ebe2294ecd0e0f08eab7690d2a6ee69', firstName: 'Amy', lastName: 'Brown', authentification: false },
    ]
    service.login(mockData[0]).subscribe( value => {
      expect(value).not.toBeNull
    })
  });

  it('should logout a user', () => {
    let mockData: any = [
      { id: 1, username: 'madams@gmail.com', password: '5f4dcc3b5aa765d61d8327deb882cf99', firstName: 'Marc', lastName: 'Adams', authentification: false },
      { id: 2, username: 'amyb@gmail.com', password: '5ebe2294ecd0e0f08eab7690d2a6ee69', firstName: 'Amy', lastName: 'Brown', authentification: false },
    ]

    service.logout(mockData[0]).subscribe( value => {
      expect(value).not.toBeNull
    })
  });
});
