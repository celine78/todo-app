import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NGXLoggerHttpServiceMock } from 'ngx-logger/testing';
import { NGXMapperServiceMock } from 'ngx-logger/testing';
import { DatePipe } from '@angular/common';
import { NGXLogger, NGXLoggerHttpService, NGXMapperService, LoggerConfig, NgxLoggerLevel } from 'ngx-logger';
import { FormBuilder } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';


import { ClearTodosComponent } from './clear-todos.component';

describe('ClearTodosComponent', () => {
  let component: ClearTodosComponent;
  let fixture: ComponentFixture<ClearTodosComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClearTodosComponent ],
      imports: [HttpClientModule, HttpClientTestingModule, RouterTestingModule, ToastrModule.forRoot()],
      providers: [
        NGXLogger,
        { provide: NGXLoggerHttpService, useClass: NGXLoggerHttpServiceMock },
        { provide: NGXMapperService, useClass: NGXMapperServiceMock },
        { provide: LoggerConfig, useValue: { level: NgxLoggerLevel.ERROR } },
        DatePipe,
        FormBuilder,
        ToastrService
      ]
    })
    .compileComponents();
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClearTodosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});