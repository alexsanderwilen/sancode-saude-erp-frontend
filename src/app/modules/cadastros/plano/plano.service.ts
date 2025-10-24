import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Plano } from './plano.model';
import { environment } from '../../../../environments/environment';
import { Page } from '../../../shared/models/page.model';

@Injectable({
  providedIn: 'root'
})
export class PlanoService {

  private apiUrl = `${environment.apiUrl}/planos`;

  constructor(private http: HttpClient) { }

  getPlanos(): Observable<Plano[]> {
    return this.getPlanosPaged(0, 1000, 'nomeComercial', 'asc').pipe(map(r => r.content));
  }

  getPlanosPaged(page: number, size: number, sort: string, order: string): Observable<Page<Plano>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', `${sort},${order}`);
    return this.http.get<Page<Plano>>(this.apiUrl, { params });
  }

  getPlano(id: number): Observable<Plano> {
    return this.http.get<Plano>(`${this.apiUrl}/${id}`);
  }

  createPlano(plano: Plano): Observable<Plano> {
    return this.http.post<Plano>(this.apiUrl, plano);
  }

  updatePlano(id: number, plano: Plano): Observable<Plano> {
    return this.http.put<Plano>(`${this.apiUrl}/${id}`, plano);
  }

  deletePlano(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

