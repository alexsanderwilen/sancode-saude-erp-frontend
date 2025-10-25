import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AbrangenciaGeografica } from './abrangencia-geografica.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AbrangenciaGeograficaService {

  private apiUrl = `${environment.apiUrl}/abrangencias-geograficas`;

  constructor(private http: HttpClient) { }

  getAbrangencias(): Observable<AbrangenciaGeografica[]> {
    return this.http.get<AbrangenciaGeografica[]>(this.apiUrl);
  }

  create(payload: Partial<AbrangenciaGeografica>): Observable<AbrangenciaGeografica> {
    return this.http.post<AbrangenciaGeografica>(this.apiUrl, payload);
  }

  update(id: number, payload: Partial<AbrangenciaGeografica>): Observable<AbrangenciaGeografica> {
    return this.http.put<AbrangenciaGeografica>(`${this.apiUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
