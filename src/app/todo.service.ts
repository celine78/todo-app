import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Todo } from './todo';

@Injectable({ providedIn: 'root' })
export class TodoService {

  constructor(private http: HttpClient) { }

  private url = 'api/todos'

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      //this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.url).pipe(catchError(this.handleError<Todo[]>('getTodos', [])));
  }

  getTodo(id: number, url?: string): Observable<Todo> {
    const urlTodo = `${this.url}/${id}`;
    return this.http.get<Todo>(urlTodo).pipe(catchError(this.handleError<Todo>(`getTodo id=${id}`))
   );
  }

  updateTodo(todo: Todo): Observable<any> {
    return this.http.put(this.url, todo, this.httpOptions).pipe(catchError(this.handleError<any>('updateTodo'))
    );
   }
 
   /** POST: add a new todo to the server */
   addTodo(todo: Todo): Observable<Todo> {
    return this.http.post<Todo>(this.url, todo, this.httpOptions).pipe(catchError(this.handleError<Todo>('addTodo'))
    );
   }
 
   /** DELETE: delete the todo from the server */
   deleteTodo(todo: Todo | number): Observable<Todo> {
    const id = typeof todo === 'number' ? todo : todo.id;
    const urlTodo = `${this.url}/${id}`;
    console.log('id delete ', id)
    console.log('todo delete ', todo)

    return this.http.delete<Todo>(urlTodo, this.httpOptions).pipe(catchError(this.handleError<Todo>('deleteTodo'))
    );
   }

   createTodoId(todos: Todo[]): number {
    return todos.length > 0 ? Math.max(...todos.map(todo => todo.id)) + 1 : 999;
  }
}
