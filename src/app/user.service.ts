import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';

import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  authUserId: number = 0;

  constructor(private http: HttpClient, private router: Router, private logger: NGXLogger) { }

  private url = 'api/users'
  users?: User[]
  user?: User

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

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
   * Getting all users in memory
   * @returns Observable of User array
   */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.url).pipe(catchError(this.handleError<User[]>('getUsers', [])));
  }

  /**
   * Getting a specific User from memory
   * @param id
   * @param url 
   * @returns Observable of User
   */
  getUser(id: number): Observable<User> {
    const urlUser = `${this.url}/${id}`;
    return this.http.get<User>(urlUser).pipe(catchError(this.handleError<User>(`getUser id=${id}`))
    );
  }

  /**
   * Putting a User into memory for updates
   * @param user 
   * @returns Observable
   */
  updateUser(user: User): Observable<any> {
    return this.http.put(this.url, user, this.httpOptions).pipe(catchError(this.handleError<any>('updateUser'))
    );
  }

  /**
   * Posting a user into memory for new users
   * @param user 
   * @returns Observable of User
   */
  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.url, user, this.httpOptions).pipe(catchError(this.handleError<User>('addUser'))
    );
  }

  /**
   * Deleting a user in memory
   * @param user 
   * @returns Observable of User
   */
  deleteUser(user: User | number): Observable<User> {
    const id = typeof user === 'number' ? user : user.id;
    const urlUser = `${this.url}/${id}`;
    return this.http.delete<User>(urlUser, this.httpOptions).pipe(catchError(this.handleError<User>('deleteUser'))
    );
  }

  /**
   * Creating an ID for each new user
   * @param users 
   * @returns A number for the ID
   */
  createUserId(users: User[]): number {
    return users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 999;
  }

  /**
   * Logging in a user and update its auth. status in memory
   * @param user
   */
  login(user: User): Observable<any> {
    user.authentification = true;
    this.setAuthUser(user.id)
    return this.http.put(this.url, user, this.httpOptions).pipe(catchError(this.handleError<any>('loginUser'))
    );
  }

  /**
   * Setting the ID of the authenticated user
   * Necessary for the Header Component
   * @param id 
   */
  setAuthUser(id: number): void {
    this.authUserId = id
  }

  /**
   * Getting the ID of the authenticated user
   * Necessary for the Header component
   */
  getAuthUser(): number {
    return this.authUserId
  }

  /**
   * Logging out a user and update its auth. status in memory 
   * @param user 
   */
  logout(user: User): Observable<any> {
    user.authentification = false;
    return this.http.put(this.url, user, this.httpOptions).pipe(catchError(this.handleError<any>('logoutUser'))
    );
  }
};

