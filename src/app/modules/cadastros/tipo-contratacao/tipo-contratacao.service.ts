import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipoContratacao } from './tipo-contratacao.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TipoContratacaoService {

  private apiUrl = `${environment.apiUrl}/tipos-contratacao`;

  constructor(private http: HttpClient) { }

  getTiposContratacao(): Observable<TipoContratacao[]> {
    return this.http.get<TipoContratacao[]>(this.apiUrl);
  }

  create(payload: Partial<TipoContratacao>): Observable<TipoContratacao> {
    return this.http.post<TipoContratacao>(this.apiUrl, payload);
  }
  update(id: number, payload: Partial<TipoContratacao>): Observable<TipoContratacao> {
    return this.http.put<TipoContratacao>(`${this.apiUrl}/${id}`, payload);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
