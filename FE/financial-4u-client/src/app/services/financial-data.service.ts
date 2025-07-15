import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FinancialDataService {
  private apiKey = '458d517e6c664bfc898cb0091af318ed';
  private baseUrl = 'https://api.twelvedata.com/time_series';

  private cache: { [symbol: string]: any } = {};

  constructor(private http: HttpClient) {
    console.log('FinancialDataService istanziato');

    const storedCache = localStorage.getItem('financialCache');
    if (storedCache) {
      this.cache = JSON.parse(storedCache);
      console.log('Cache recuperata dal localStorage:', this.cache);
    }
  }

  getHistoricalData(symbol: string): Observable<any> {
    console.log(`Richiesta per ${symbol}`);

    if (this.cache[symbol]) {
      console.log(`Dati in cache trovati per ${symbol}`, this.cache[symbol]);
      return of(this.cache[symbol]);
    }

    const url = `${this.baseUrl}?symbol=${symbol}&interval=1day&outputsize=5000&apikey=${this.apiKey}`;

    return this.http.get(url).pipe(
      tap((data) => {
        console.log(`Dati ricevuti da API per ${symbol}`, data);
        this.cache[symbol] = data;

        localStorage.setItem('financialCache', JSON.stringify(this.cache));
      }),
    );
  }
}
