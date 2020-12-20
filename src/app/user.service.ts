import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  authUserId: number = 0;

  constructor(private http: HttpClient, private router: Router) { }

  private url = 'api/users'
  users?: User[]
  user?: User

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

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

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.url).pipe(catchError(this.handleError<User[]>('getUsers', [])));
  }

  getUser(id: number): Observable<User> {
    const urlUser = `${this.url}/${id}`;
    console.log('urluser', urlUser)
    return this.http.get<User>(urlUser).pipe(catchError(this.handleError<User>(`getUser id=${id}`))
    );
  }

  updateUser(user: User): Observable<any> {
    return this.http.put(this.url, user, this.httpOptions).pipe(catchError(this.handleError<any>('updateUser'))
    );
  }

  /** POST: add a new todo to the server */
  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.url, user, this.httpOptions).pipe(catchError(this.handleError<User>('addUser'))
    );
  }

  /** DELETE: delete the todo from the server */
  deleteUser(user: User | number): Observable<User> {
    const id = typeof user === 'number' ? user : user.id;
    const urlUser = `${this.url}/${id}`;

    return this.http.delete<User>(urlUser, this.httpOptions).pipe(catchError(this.handleError<User>('deleteUser'))
    );
  }

  login(user: User): Observable<any> {
    user.authentification = true;
    this.setAuthUser(user.id)
    return this.http.put(this.url, user, this.httpOptions).pipe(catchError(this.handleError<any>('loginUser'))
    );
  }

  logout(user: User): Observable<any> {
    user.authentification = false;
    return this.http.put(this.url, user, this.httpOptions).pipe(catchError(this.handleError<any>('logoutUser'))
    );
  }

  createUserId(users: User[]): number {
    return users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 999;
  }

  setAuthUser(id: number): void{
    this.authUserId = id
  }

  getAuthUser(): number {
    return this.authUserId
  }

};

