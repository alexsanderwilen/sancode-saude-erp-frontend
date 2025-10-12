import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DominioTipo } from './dominio-tipo.model';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DominioTipoService {
  private apiUrl = `${environment.apiUrl}/dominio-tipos`; // Ajuste a URL da API conforme necessário

  private http = inject(HttpClient);

  findAll(): Observable<DominioTipo[]> {
    return this.http.get<DominioTipo[]>(this.apiUrl);
  }

  findById(id: number): Observable<DominioTipo> {
    return this.http.get<DominioTipo>(`${this.apiUrl}/${id}`);
  }

  create(dominioTipo: DominioTipo): Observable<DominioTipo> {
    return this.http.post<DominioTipo>(this.apiUrl, dominioTipo);
  }

  update(id: number, dominioTipo: DominioTipo): Observable<DominioTipo> {
    return this.http.put<DominioTipo>(`${this.apiUrl}/${id}`, dominioTipo);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
