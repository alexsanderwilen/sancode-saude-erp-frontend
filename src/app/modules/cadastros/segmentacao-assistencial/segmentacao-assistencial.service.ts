import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { SegmentacaoAssistencial } from './segmentacao-assistencial.model';
import { environment } from '../../../../environments/environment';
import { Page } from '../../../shared/models/page.model';

@Injectable({
  providedIn: 'root'
})
export class SegmentacaoAssistencialService {

  private apiUrl = `${environment.apiUrl}/segmentacoes-assistenciais`;

  constructor(private http: HttpClient) { }

  getSegmentacoes(): Observable<SegmentacaoAssistencial[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((res: any) => Array.isArray(res) ? res as SegmentacaoAssistencial[] : ((res?.content ?? []) as SegmentacaoAssistencial[]))
    );
  }

  getSegmentacoesPaged(page: number, size: number, sort: string, order: string): Observable<Page<SegmentacaoAssistencial>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', `${sort},${order}`);
    return this.http.get<Page<SegmentacaoAssistencial>>(this.apiUrl, { params });
  }

  create(payload: Partial<SegmentacaoAssistencial>): Observable<SegmentacaoAssistencial> {
    return this.http.post<SegmentacaoAssistencial>(this.apiUrl, payload);
  }

  update(id: number, payload: Partial<SegmentacaoAssistencial>): Observable<SegmentacaoAssistencial> {
    return this.http.put<SegmentacaoAssistencial>(`${this.apiUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
