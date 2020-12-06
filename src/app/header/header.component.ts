import { Component, OnInit } from '@angular/core';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { DialogComponent } from '../dialog/dialog.component';
import { TodoService } from '../todo.service';
import { Todo } from '../todo'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private dialog: MatDialog, private todoService: TodoService, private router: Router) { }

  ngOnInit(): void {
    this.getTodos()
  }

  dialogComponent = DialogComponent;
  dialogRef!: any;
  dialogConfig = new MatDialogConfig();
  todos: Todo[] = []

  getTodos(): void {
    this.todoService.getTodos().subscribe((todos: Todo[]) => this.todos = todos);
  }
  

  clear(): void {
    this.dialogRef = this.dialog ? this.dialog.open(DialogComponent, {
      data: {
            title: 'Clear Todo\'s',
            body: 'Are you sure that you want to delete all your todo\'s ?',
            btnTextLeft: 'Cancel',
            btnTextRight: 'Delete',
      }
    }) :

    //calling the variable
    //https://stackblitz.com/edit/mat-dialog-example?file=app%2Fapp.component.ts
    this.dialogRef = this.dialogRef

    this.dialogRef.afterClosed().subscribe((accepted: boolean) => {
      if(accepted) { 
        this.deleteTodos()
        this.router.navigate(['/waiting'])
      } else { console.log('Did not clear all todos.') }
    });
  }

  deleteTodos(): void {
    this.todos.forEach( (todo) => {
      this.todoService.deleteTodo(todo).subscribe();
    })
  }


}
