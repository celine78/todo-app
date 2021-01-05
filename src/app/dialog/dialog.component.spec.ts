import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NGXLoggerHttpServiceMock } from 'ngx-logger/testing';
import { NGXMapperServiceMock } from 'ngx-logger/testing';
import { DatePipe } from '@angular/common';
import { NGXLogger, NGXLoggerHttpService, NGXMapperService, LoggerConfig, NgxLoggerLevel } from 'ngx-logger';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from "@angular/material/dialog";
import { MatDialogHarness } from '@angular/material/dialog/testing';

import { DialogComponent } from './dialog.component';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogComponent ],
      providers: [
        NGXLogger,
        { provide: NGXLoggerHttpService, useClass: NGXLoggerHttpServiceMock },
        { provide: NGXMapperService, useClass: NGXMapperServiceMock },
        { provide: LoggerConfig, useValue: { level: NgxLoggerLevel.ERROR } },
        { provide: MatDialog, useClass: MatDialogHarness },
        DatePipe,
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        MatDialogModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
