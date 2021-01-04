import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClearTodosComponent } from './clear-todos.component';

describe('ClearTodosComponent', () => {
  let component: ClearTodosComponent;
  let fixture: ComponentFixture<ClearTodosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClearTodosComponent ]
    })
    .compileComponents();
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
