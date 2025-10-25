import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { DominioTipo } from './dominio-tipo.model';
import { environment } from '@environments/environment';
import { Page } from '../../../shared/models/page.model';

@Injectable({
  providedIn: 'root'
})
export class DominioTipoService {
  private apiUrl = `${environment.apiUrl}/dominio-tipos`; // Ajuste a URL da API conforme necessário

  private http = inject(HttpClient);

  findAll(): Observable<DominioTipo[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(res => {
        const items = Array.isArray(res) ? res : (res?.content || []);
        return items.map((item: any) => this.mapToFrontend(item));
      })
    );
  }

  findPaged(page: number, size: number, sort: string, order: string): Observable<Page<DominioTipo>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', `${sort},${order}`);
    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map((res: any) => ({
        content: (res.content || []).map((item: any) => this.mapToFrontend(item)),
        totalPages: res.totalPages,
        totalElements: res.totalElements,
        size: res.size,
        number: res.number,
        numberOfElements: res.numberOfElements,
        first: res.first,
        last: res.last,
        empty: res.empty
      }))
    );
  }

  findById(id: number): Observable<DominioTipo> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(item => this.mapToFrontend(item))
    );
  }

  create(dominioTipo: DominioTipo): Observable<DominioTipo> {
    const backendData = this.mapToBackend(dominioTipo);
    return this.http.post<any>(this.apiUrl, backendData).pipe(
      map(item => this.mapToFrontend(item))
    );
  }

  update(id: number, dominioTipo: DominioTipo): Observable<DominioTipo> {
    const backendData = this.mapToBackend(dominioTipo);
    return this.http.put<any>(`${this.apiUrl}/${id}`, backendData).pipe(
      map(item => this.mapToFrontend(item))
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private mapToBackend(dominioTipo: DominioTipo): any {
    return {
      id: dominioTipo.id,
      tipoDoTipo: dominioTipo.tipoDoTipo,
      descricao: dominioTipo.descricao,
      ativo: dominioTipo.status
    };
  }

  private mapToFrontend(item: any): DominioTipo {
    return {
      id: item.id,
      tipoDoTipo: item.tipoDoTipo,
      descricao: item.descricao,
      status: item.ativo
    };
  }
}
