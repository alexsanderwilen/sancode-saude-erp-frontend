import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipoContratacao } from './tipo-contratacao.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TipoContratacaoService {

  private apiUrl = `${environment.apiUrl}/tipos-contratacao`;

  constructor(private http: HttpClient) { }

  getTiposContratacao(): Observable<TipoContratacao[]> {
    return this.http.get<TipoContratacao[]>(this.apiUrl);
  }
}
