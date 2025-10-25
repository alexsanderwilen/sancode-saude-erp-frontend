import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SegmentacaoAssistencial } from './segmentacao-assistencial.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SegmentacaoAssistencialService {

  private apiUrl = `${environment.apiUrl}/segmentacoes-assistenciais`;

  constructor(private http: HttpClient) { }

  getSegmentacoes(): Observable<SegmentacaoAssistencial[]> {
    return this.http.get<SegmentacaoAssistencial[]>(this.apiUrl);
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
