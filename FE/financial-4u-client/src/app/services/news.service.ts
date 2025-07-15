import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { News } from '../models/news.model';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private API_URL = 'http://localhost:8080/api/private/get-news';

  constructor(private http: HttpClient) {}

  getNews(): Observable<News[]> {
    const credentials = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Basic ${credentials}`,
    });

    return this.http.get<News[]>(this.API_URL, { headers });
  }
}
