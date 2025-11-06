import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from './usuario.model';
import { environment } from '../../../../environments/environment';
import { ApiService } from '../../../core/services/api.service';
import { Page } from '../../../shared/models/page.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private readonly endpoint = `${environment.apiUrl}/usuarios`;

  constructor(private api: ApiService) { }

  getUsuarios(page: number, size: number, sort: string, order: string): Observable<Page<Usuario>> {
    const path = this.endpoint.replace(environment.apiUrl, '');
    return this.api.page<Usuario>(path, { page, size, sort, order: order as 'asc' | 'desc' });
  }

  getUsuario(id: number): Observable<Usuario> { return this.api.get<Usuario>(`${this.endpoint}/${id}`); }

  createUsuario(usuario: Usuario): Observable<Usuario> { return this.api.post<Usuario>(this.endpoint, usuario); }

  updateUsuario(id: number, usuario: Usuario): Observable<Usuario> { return this.api.put<Usuario>(`${this.endpoint}/${id}`, usuario); }

  deleteUsuario(id: number): Observable<string> { return this.api.delete(`${this.endpoint}/${id}`); }
}

