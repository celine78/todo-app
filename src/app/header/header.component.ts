import { Component, OnInit } from '@angular/core';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogComponent } from '../dialog/dialog.component';
import { ToastrService } from 'ngx-toastr';
import { NGXLogger } from 'ngx-logger';
import { throwError } from 'rxjs';

import { TodoService } from '../todo.service';
import { UserService } from '../user.service';
import { Todo } from '../todo';
import { User } from '../user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private todoService: TodoService,
    private router: Router,
    private userService: UserService,
    private toastr: ToastrService,
    private logger: NGXLogger
  ) { }

  ngOnInit(): void {
    this.checkAuth()
  }

  dialogComponent = DialogComponent;
  dialogRef!: any;
  dialogConfig = new MatDialogConfig();
  todos: Todo[] = []
  users: User[] = []
  userTodos: Todo[] = [];
  user?: User;

  /**
   * Getting all users and todos from memory during initialization
   * source: https://stackblitz.com/edit/angular-async-await-eg?file=src%2Fapp%2Fapp.component.ts
   */
  async checkAuth() {
    this.users = await this.getUsers()
    this.todos = await this.getTodos()
  }

  /**
   * Getting all users in memory
   */
  getUsers() {
    return this.userService.getUsers().toPromise().catch(error => { this.logger.error(error); return [] }
    )
  }

  /**
   * Getting all todos in memory
   */
  getTodos() {
    return this.todoService.getTodos().toPromise().catch(error => { this.logger.error(error); return [] }
    )
  }

  /**
   * Deleting all todos of the authenticated user
   */
  clear(): void {
    try {
      // source: https://stackblitz.com/edit/mat-dialog-example?file=app%2Fapp.component.ts
      this.dialogRef = this.dialog ?
        this.dialog.open(DialogComponent, {
          data: {
            title: 'Clear Todo\'s',
            body: 'Are you sure that you want to delete all your todo\'s ?',
            btnTextLeft: 'Cancel',
            btnTextRight: 'Delete',
          }
        }) :
        // calling the variable
        this.dialogRef = this.dialogRef

      // getting result of dialog
      this.dialogRef.afterClosed().subscribe((accepted: boolean) => {
        // if dialog accepted
        if (accepted) {
          this.logger.info('Rerouting to clear-todos')
          this.router.navigate(['/clear-todos'])
        } else { this.logger.debug('Dialog not accepted') }
      });
    } catch (error) {
      this.logger.error('Error : ', error)
      this.toastr.error('An error occured with the clear dialog')
      throwError(new Error(error))
    }
  }

  /**
   * Logging out an authenticated user
   */
  logout(): void {
    try {
      // source: https://stackblitz.com/edit/mat-dialog-example?file=app%2Fapp.component.ts
      this.dialogRef = this.dialog ?
        this.dialog.open(DialogComponent, {
          data: {
            title: 'Logout',
            body: 'Are you sure that you want to logout ?',
            btnTextLeft: 'Cancel',
            btnTextRight: 'Logout',
          }
        }) :
        //calling the variable
        this.dialogRef = this.dialogRef

      // getting result of dialog
      this.dialogRef.afterClosed().subscribe((accepted: boolean) => {
        // if logout is confirmed
        if (accepted) {
          this.userLogout()
          this.toastr.info('Logging out')
          this.logger.debug('Rerouting to logout')
          this.router.navigate(['/logout'])
        } else { this.logger.debug('Dialog not accepted') }
      });
    } catch (error) {
      this.logger.error('Error : ', error)
      this.toastr.error('An error occured with the logout dialog')
      throwError(new Error(error))
    }

  }

  /**
   * Logging out the user in memory
   */
  userLogout(): void {
    try {
      // get id of logged in user
      let id = this.userService.getAuthUser()
      let users: User[] = []
      users = this.users.filter(user => user.id == id)
      this.user = users.shift()
  
      if (this.user) {
        this.user.authentification = false;
        this.userService.logout(this.user).subscribe();
      } else {
        this.logger.info('No user could be found to logout')
      }
    } catch (error) {
      this.logger.error('Error : ', error)
      this.toastr.error('An error occured while logging out')
      throwError(new Error(error))
    }
  }
}
