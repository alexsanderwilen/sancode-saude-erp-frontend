import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Plano } from './plano.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlanoService {

  private apiUrl = `${environment.apiUrl}/planos`;

  constructor(private http: HttpClient) { }

  getPlanos(): Observable<Plano[]> {
    return this.http.get<Plano[]>(this.apiUrl);
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