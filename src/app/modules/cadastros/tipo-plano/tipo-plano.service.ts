import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TipoPlano } from './tipo-plano.model';

@Injectable({ providedIn: 'root' })
export class TipoPlanoService {
  private apiUrl = `${environment.apiUrl}/tipos-plano`;
  constructor(private http: HttpClient) {}
  getTiposPlano(): Observable<TipoPlano[]> { return this.http.get<TipoPlano[]>(this.apiUrl); }
}


