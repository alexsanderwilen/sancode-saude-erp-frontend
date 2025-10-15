import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Operadora, Page } from './operadora.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OperadoraService {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl + '/operadoras';

  getOperadoras(page: number, size: number, sort: string, order: string): Observable<Page<Operadora>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', `${sort},${order}`);
    return this.http.get<Page<Operadora>>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Operadora> {
    return this.http.get<Operadora>(`${this.apiUrl}/${id}`);
  }

  create(operadora: Operadora): Observable<Operadora> {
    return this.http.post<Operadora>(this.apiUrl, operadora);
  }

  update(id: string, operadora: Operadora): Observable<Operadora> {
    return this.http.put<Operadora>(`${this.apiUrl}/${id}`, operadora);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
