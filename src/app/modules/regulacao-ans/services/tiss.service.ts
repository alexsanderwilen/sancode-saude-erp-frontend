import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TissService {
  private base = `${environment.apiUrl}/ans/tiss`;
  constructor(private http: HttpClient) {}

  validate(xml: string, profile = 'default'): Observable<any> {
    const params = new HttpParams().set('profile', profile);
    return this.http.post(`${this.base}/validate`, xml, { params });
  }

  upload(file: File, profile = 'default'): Observable<any> {
    const form = new FormData();
    form.append('file', file);
    return this.http.post(`${this.base}/upload?version=${profile}`, form);
  }
}
