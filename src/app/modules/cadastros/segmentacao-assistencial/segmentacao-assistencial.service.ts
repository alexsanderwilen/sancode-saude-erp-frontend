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
}
