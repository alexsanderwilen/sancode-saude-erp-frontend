import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

// Definindo a interface para o objeto do grupo, para tipagem forte.
export interface ChatGroup {
  id: number;
  name: string;
  description: string;
  createdBy: string;
  createdAt: string; // ou Date
  members: any[]; // Pode ser uma interface mais específica de GroupMember
}

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.chatApiUrl}/groups`;

  /**
   * Busca a lista de grupos dos quais o usuário autenticado faz parte.
   */
  getMyGroups(): Observable<ChatGroup[]> {
    return this.http.get<ChatGroup[]>(`${this.apiUrl}/my-groups`);
  }

  /**
   * Cria um novo grupo.
   * @param name O nome do grupo.
   * @param description A descrição do grupo.
   */
  createGroup(name: string, description: string, members: string[]): Observable<ChatGroup> {
    return this.http.post<ChatGroup>(this.apiUrl, { name, description, members });
  }

  /**
   * Busca um grupo pelo seu ID.
   * @param id O ID do grupo.
   * @returns Um Observable contendo o grupo encontrado.
   */
  getGroupById(id: string): Observable<ChatGroup> {
    return this.http.get<ChatGroup>(`${this.apiUrl}/${id}`);
  }

  /**
   * Adiciona um usuário a um grupo.
   * @param groupId O ID do grupo.
   * @param userId O ID do usuário a ser adicionado.
   */
  addUserToGroup(groupId: string, userId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${groupId}/members/${userId}`, {});
  }

  /**
   * Adiciona um usuário ao grupo por username.
   */
  addUserToGroupByUsername(groupId: string, username: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${groupId}/members/by-username/${encodeURIComponent(username)}`, {});
  }

  /**
   * Remove um usuário de um grupo.
   * @param groupId O ID do grupo.
   * @param userId O ID do usuário a ser removido.
   */
  removeUserFromGroup(groupId: string, userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${groupId}/members/${userId}`);
  }

  /**
   * Remove um usuário do grupo por username.
   */
  removeUserFromGroupByUsername(groupId: string, username: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${groupId}/members/by-username/${encodeURIComponent(username)}`);
  }
}
