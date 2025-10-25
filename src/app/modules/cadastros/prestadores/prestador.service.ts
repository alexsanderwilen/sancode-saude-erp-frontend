import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prestador } from './prestador.model';
import { environment } from '../../../../environments/environment';
import { Page } from '../../../shared/models/page.model';

@Injectable({
  providedIn: 'root'
})
export class PrestadorService {

  private apiUrl = `${environment.apiUrl}/prestadores`;

  constructor(private http: HttpClient) { }

  getPrestadores(): Observable<Prestador[]> {
    // fallback non-paginado
    return this.http.get<Prestador[]>(this.apiUrl);
  }

  getPrestadoresPaged(page: number, size: number, sort: string, order: string): Observable<Page<Prestador>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', `${sort},${order}`);
    return this.http.get<Page<Prestador>>(this.apiUrl, { params });
  }

  getPrestador(id: number): Observable<Prestador> {
    return this.http.get<Prestador>(`${this.apiUrl}/${id}`);
  }

  createPrestador(prestador: Prestador): Observable<Prestador> {
    return this.http.post<Prestador>(this.apiUrl, prestador);
  }

  updatePrestador(id: number, prestador: Prestador): Observable<Prestador> {
    return this.http.put<Prestador>(`${this.apiUrl}/${id}`, prestador);
  }

  deletePrestador(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
