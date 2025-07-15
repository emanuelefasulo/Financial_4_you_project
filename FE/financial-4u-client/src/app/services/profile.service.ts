import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private apiUrlGet = 'http://localhost:8080/api/private/profile';

  constructor(private http: HttpClient) {}

  getProfileById(id: number): Observable<any> {
    const credentials = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Basic ${credentials}`,
    });
    return this.http.get<any>(`${this.apiUrlGet}?id=${id}`, { headers });
  }
}
