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
  private readMap = new Map<string, Map<string, string>>(); // convId -> reader -> ISO time
  private rrTick$ = new BehaviorSubject<number>(0);

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
      this.stomp!.subscribe('/user/queue/read-receipts', (msg: IMessage) => {
        const data = JSON.parse(msg.body) as { conversationId: string; readerUsername: string; lastReadAt: string };
        const conv = data.conversationId;
        if (!this.readMap.has(conv)) this.readMap.set(conv, new Map());
        this.readMap.get(conv)!.set(data.readerUsername, data.lastReadAt);
        this.rrTick$.next(this.rrTick$.value + 1);
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

  // Bootstrapping da leitura do outro participante (privado)
  fetchPrivateReadState(otherUsername: string) {
    return this.http.get<{ conversationId: string; readerUsername: string; lastReadAt: string }>(`${CHAT_API_URL}/unread/read-state/private/${otherUsername}`);
  }

  getPrivateLastRead(otherUsername: string, selfUsername: string): Date | null {
    const ids = [otherUsername, selfUsername].sort().join('_');
    const map = this.readMap.get(ids);
    const iso = map?.get(otherUsername);
    return iso ? new Date(iso) : null;
  }

  onReadReceipts() {
    return this.rrTick$.asObservable();
  }
}
