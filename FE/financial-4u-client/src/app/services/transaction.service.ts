import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private apiUrl = 'http://localhost:8080/api/private/insert-transaction';
  constructor(private http: HttpClient) {}

  insertTransaction(transactionData: any): Observable<any> {
    const credentials = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Basic ${credentials}`,
    });

    return this.http.post(this.apiUrl, transactionData, { headers });
  }
}
