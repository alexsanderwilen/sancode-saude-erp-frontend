import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SibService {
  private base = `${environment.apiUrl}/ans/sib`;
  constructor(private http: HttpClient) {}

  exportMov(competencia: string, usuario?: string): Observable<{ idExport: number; storageKey: string; filename: string; size: number }> {
    let params = new HttpParams().set('competencia', competencia);
    if (usuario) params = params.set('usuario', usuario);
    return this.http.post<{ idExport: number; storageKey: string; filename: string; size: number }>(`${this.base}/export`, {}, { params });
  }

  exportXml(competencia: string, usuario?: string): Observable<{ idExport: number; storageKey: string; filename: string; size: number }> {
    let params = new HttpParams().set('competencia', competencia).set('formato', 'xml');
    if (usuario) params = params.set('usuario', usuario);
    return this.http.post<{ idExport: number; storageKey: string; filename: string; size: number }>(`${this.base}/export`, {}, { params });
  }
}
