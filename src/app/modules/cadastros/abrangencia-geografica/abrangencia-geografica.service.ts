import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AbrangenciaGeografica } from './abrangencia-geografica.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AbrangenciaGeograficaService {

  private apiUrl = `${environment.apiUrl}/abrangencias-geograficas`;

  constructor(private http: HttpClient) { }

  getAbrangencias(): Observable<AbrangenciaGeografica[]> {
    return this.http.get<AbrangenciaGeografica[]>(this.apiUrl);
  }
}
