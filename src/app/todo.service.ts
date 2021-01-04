import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';

import { Todo } from './todo';

@Injectable({ providedIn: 'root' })
export class TodoService {

  constructor(private http: HttpClient, private logger: NGXLogger) { }

  private url = 'api/todos'

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  /**
   * A personalised error handler
   * source: Angular's Heroes tour
   * @param operation
   * @param result 
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.logger.error('Error : ', error)
      return of(result as T);
    };
  }

  /**
   * Getting all todos in memory
   * @returns Observable of Todo array
   */
  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.url).pipe(catchError(this.handleError<Todo[]>('getTodos', [])));
  }

  /**
   * Getting a specific todo from memory
   * @param id
   * @param url 
   * @returns Observable of Todo
   */
  getTodo(id: number, url?: string): Observable<Todo> {
    const urlTodo = `${this.url}/${id}`;
    return this.http.get<Todo>(urlTodo).pipe(catchError(this.handleError<Todo>(`getTodo id=${id}`))
    );
  }

  /**
   * Putting a todo into memory for updates
   * @param todo 
   * @returns Observable
   */
  updateTodo(todo: Todo): Observable<any> {
    return this.http.put(this.url, todo, this.httpOptions).pipe(catchError(this.handleError<any>('updateTodo'))
    );
  }

  /**
   * Posting a todo into memory for new todos
   * @param todo 
   * @returns Observable of Todo
   */
  addTodo(todo: Todo): Observable<Todo> {
    return this.http.post<Todo>(this.url, todo, this.httpOptions).pipe(catchError(this.handleError<Todo>('addTodo'))
    );
  }

  /**
   * Deleting a todo in memory
   * @param todo 
   * @returns Observable of Todo
   */
  deleteTodo(todo: Todo | number): Observable<Todo> {
    const id = typeof todo === 'number' ? todo : todo.id;
    const urlTodo = `${this.url}/${id}`;
    return this.http.delete<Todo>(urlTodo, this.httpOptions).pipe(catchError(this.handleError<Todo>('deleteTodo'))
    );
  }

  /**
   * Creating an ID for each new todo
   * @param todos 
   * @returns A number for the ID
   */
  createTodoId(todos: Todo[]): number {
    return todos.length > 0 ? Math.max(...todos.map(todo => todo.id)) + 1 : 999;
  }
}
