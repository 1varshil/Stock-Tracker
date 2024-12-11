// stock.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private baseURL = 'https://finnhub.io/api/v1/quote';
  private apiKey = 'csob5rpr01qt3r3490fgcsob5rpr01qt3r3490g0';

  constructor(private http: HttpClient) { }

  getStockPrice(symbol: string): Observable<any> {
    const url = `${this.baseURL}?symbol=${symbol}&token=${this.apiKey}`;
    return this.http.get(url);
  }
}
