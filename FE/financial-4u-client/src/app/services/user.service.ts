import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/private/user';

  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();
  private userUpdated = new Subject<void>();

  constructor(private http: HttpClient) {}

  notifyUserUpdate() {
    this.userUpdated.next();
  }

  onUserUpdate(): Observable<void> {
    return this.userUpdated.asObservable();
  }

  getUserById(userId: number): Observable<any> {
    const credentials = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Basic ${credentials}`,
    });

    return this.http.get<any>(`${this.apiUrl}/${userId}`, { headers });
  }

  setUser(user: any) {
    this.userSubject.next(user);
  }

  getUser() {
    return this.userSubject.value;
  }
}
