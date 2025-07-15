import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private apiUrl = 'http://localhost:8080/api/public/insert-account';

  constructor(private http: HttpClient) {}

  register(userData: any): Observable<any> {
    const credentials = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Basic ${credentials}`,
    });

    return this.http.post<any>(this.apiUrl, userData, { headers });
  }
}
