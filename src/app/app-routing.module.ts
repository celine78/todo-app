import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TodosComponent } from './todos/todos.component';
import { TodoEditComponent } from './todo-edit/todo-edit.component';
import { TodoDetailsComponent } from './todo-details/todo-details.component';
import { TodoAddComponent } from './todo-add/todo-add.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { WaitingPageComponent } from './waiting-page/waiting-page.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';


const routes: Routes = [
  { path: '', redirectTo: '/todos', pathMatch: 'full'},
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'todos', component: TodosComponent},
  { path: 'todo-edit/:id', component: TodoEditComponent},
  { path: 'todo-add', component: TodoAddComponent},
  { path: 'todo-detail/:id', component: TodoDetailsComponent},
  { path: 'waiting', component: WaitingPageComponent},
  { path: '**', component: ErrorPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
