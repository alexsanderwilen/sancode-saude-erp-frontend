import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private apiUrl = '/api/chat/groups';

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
}
