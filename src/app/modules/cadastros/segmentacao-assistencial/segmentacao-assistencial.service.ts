import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { SegmentacaoAssistencial } from './segmentacao-assistencial.model';
import { environment } from '../../../../environments/environment';
import { Page } from '../../../shared/models/page.model';
import { ApiService } from '../../../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class SegmentacaoAssistencialService {

  private readonly endpoint = `${environment.apiUrl}/segmentacoes-assistenciais`;

  constructor(private api: ApiService) { }

  getSegmentacoes(): Observable<SegmentacaoAssistencial[]> {
    return this.api.get<any>(this.endpoint).pipe(
      map((res: any) => Array.isArray(res) ? res as SegmentacaoAssistencial[] : ((res?.content ?? []) as SegmentacaoAssistencial[]))
    );
  }

  getSegmentacoesPaged(page: number, size: number, sort: string, order: string): Observable<Page<SegmentacaoAssistencial>> {
    const path = this.endpoint.replace(environment.apiUrl, '');
    return this.api.page<SegmentacaoAssistencial>(path, { page, size, sort, order: order as 'asc' | 'desc' });
  }

  create(payload: Partial<SegmentacaoAssistencial>): Observable<SegmentacaoAssistencial> {
    return this.api.post<SegmentacaoAssistencial>(this.endpoint, payload);
  }

  update(id: number, payload: Partial<SegmentacaoAssistencial>): Observable<SegmentacaoAssistencial> {
    return this.api.put<SegmentacaoAssistencial>(`${this.endpoint}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }
}

