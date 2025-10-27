import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CoberturaAdicional } from './cobertura-adicional.model';

@Injectable({ providedIn: 'root' })
export class CoberturaAdicionalService {
  private apiUrl = `${environment.apiUrl}/coberturas-adicionais`;
  constructor(private http: HttpClient) {}
  getCoberturas(): Observable<CoberturaAdicional[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(items => (items || []).map(this.fromBackend))
    );
  }

  create(payload: Partial<CoberturaAdicional>): Observable<CoberturaAdicional> {
    return this.http.post<any>(this.apiUrl, this.toBackend(payload)).pipe(map(this.fromBackend));
  }
  update(id: number, payload: Partial<CoberturaAdicional>): Observable<CoberturaAdicional> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, this.toBackend(payload)).pipe(map(this.fromBackend));
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private fromBackend = (item: any): CoberturaAdicional => ({
    id: item.id,
    descricao: item.descricao,
    descricaoDetalhada: item.descricao_detalhada ?? item.descricaoDetalhada,
    tipo: item.tipo,
    obrigatoriaAns: item.obrigatoriaAns ?? item.obrigatoria_ans
  });

  private toBackend(payload: Partial<CoberturaAdicional>): any {
    return {
      id: payload.id,
      descricao: payload.descricao,
      descricao_detalhada: (payload as any).descricaoDetalhada ?? (payload as any).descricao_detalhada,
      tipo: payload.tipo,
      obrigatoriaAns: payload.obrigatoriaAns
    };
  }
}

