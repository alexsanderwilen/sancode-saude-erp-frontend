import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WEBSOCKET_URL = '/ws-chat';
const CHAT_API_URL = '/api/chat';

export interface ConversationUnreadDto {
  type: 'private' | 'group';
  id: string; // username or groupId
  name: string;
  count: number;
}

export interface UnreadSummaryDto {
  total: number;
  conversations: ConversationUnreadDto[];
}

@Injectable({ providedIn: 'root' })
export class UnreadNotificationService {
  private stomp: Client | null = null;
  private summary$ = new BehaviorSubject<UnreadSummaryDto>({ total: 0, conversations: [] });

  constructor(private http: HttpClient) {}

  connect(): void {
    const token = localStorage.getItem('token');
    if (!token || (this.stomp && this.stomp.active)) return;

    this.stomp = new Client();
    this.stomp.webSocketFactory = () => new SockJS(WEBSOCKET_URL);
    this.stomp.configure({
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });
    this.stomp.onConnect = () => {
      this.stomp!.subscribe('/user/queue/unread', (msg: IMessage) => {
        const data = JSON.parse(msg.body) as UnreadSummaryDto;
        this.summary$.next(data);
      });
      // bootstrap inicial
      this.refresh().subscribe();
    };
    this.stomp.activate();
  }

  disconnect(): void {
    if (this.stomp && this.stomp.active) this.stomp.deactivate();
    this.stomp = null;
  }

  getSummary(): Observable<UnreadSummaryDto> {
    return this.summary$.asObservable();
  }

  refresh(): Observable<UnreadSummaryDto> {
    return this.http.get<UnreadSummaryDto>(`${CHAT_API_URL}/unread/conversations`);
  }

  markRead(type: 'private' | 'group', id: string): Observable<void> {
    return this.http.post<void>(`${CHAT_API_URL}/unread/conversations/${type}/${id}/read`, {});
  }
}
