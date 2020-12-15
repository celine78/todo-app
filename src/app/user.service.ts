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

  constructor(private http: HttpClient, private router: Router) { }

  private url = 'api/users'
  users!: User[]
  user!: User

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
    return this.http.put(this.url, user, this.httpOptions).pipe(catchError(this.handleError<any>('loginUser'))
    );
  }

  logout(user: User): Observable<any> {
    user.authentification = false;
    return this.http.put(this.url, user, this.httpOptions).pipe(catchError(this.handleError<any>('logoutUser'))
    );
  }

  /*checkAuth(): void {
    this.getUsers().subscribe((users: User[]) => this.users = users);
    console.log('test: ',this.users)
    this.users.forEach( (user) => {
      if(user.authentification === true){
        this.user = user;
        return this.user
      } else { 
        return this.router.navigate(['/login'])
      }
    })
  }*/

  /*getAuth(title: Title): Observable<any> {
    //if(user != undefined && user.authentification != false) {
    return this.http.put('api/titles', title, this.httpOptions).pipe(catchError(this.handleError<any>('updateTitle'))
    );
  }*/
    // status = 'Profile' : status = 'Login'
    //return title
};

