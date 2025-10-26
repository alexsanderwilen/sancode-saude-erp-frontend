import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Page } from '@shared/models/page.model';
import { Usuario } from '@shared/models/usuario.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/usuarios`;

  /**
   * Busca uma lista paginada de todos os usuários da aplicação.
   * @param page O número da página a ser buscada.
   * @param size O tamanho da página.
   * @returns Um Observable contendo uma página de usuários.
   */
  getAllUsers(page: number = 0, size: number = 20): Observable<Page<Usuario>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<Usuario>>(this.apiUrl, { params });
  }

  /**
   * Busca uma lista não paginada de todos os usuários.
   * @returns Um Observable contendo um array de todos os usuários.
   */
  getAllUsersUnpaged(): Observable<Usuario[]> {
    // Pede uma página grande para buscar todos os usuários de uma vez.
    // Em uma aplicação real com muitos usuários, a paginação com scroll infinito seria melhor.
    return this.getAllUsers(0, 1000).pipe(
      map(page => page.content)
    );
  }

  /**
   * Busca um usuário específico pelo seu nome de usuário.
   * @param username O nome de usuário a ser buscado.
   * @returns Um Observable contendo o usuário encontrado.
   */
  getUserByUsername(username: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/username/${username}`);
  }
}

