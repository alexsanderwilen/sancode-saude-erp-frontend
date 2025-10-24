import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PlanoBase } from './plano-base.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlanoBaseService {

  private apiUrl = `${environment.apiUrl}/planos-base`;

  constructor(private http: HttpClient) { }

  getPlanosBase(): Observable<PlanoBase[]> {
    return this.http.get<PlanoBase[]>(this.apiUrl);
  }
}
