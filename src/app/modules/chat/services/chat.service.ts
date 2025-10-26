import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatMessage } from '../components/chat-room/chat-room.component';
import { ConversationDto } from '../models/conversation.model';

const WEBSOCKET_URL = environment.chatWsUrl;
const CHAT_API_URL = environment.chatApiUrl;

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private stompClient: Client | null = null;
  private messageSubject = new BehaviorSubject<ChatMessage | null>(null);

  constructor(private http: HttpClient) {}

  connect(username: string): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token de autenticação não encontrado.');
      return;
    }

    if (!this.stompClient || !this.stompClient.active) {
      this.stompClient = new Client();

      this.stompClient.webSocketFactory = () => new SockJS(WEBSOCKET_URL);

      this.stompClient.configure({
        connectHeaders: {
          Authorization: `Bearer ${token}`
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      this.stompClient.onConnect = (frame) => {
        if (this.stompClient) {
          // Inscrição para receber mensagens privadas
          this.stompClient.subscribe('/user/queue/messages', (message: IMessage) => {
            this.messageSubject.next(JSON.parse(message.body));
          });

          // Inscrição para receber mensagens de grupo (exemplo)
          // O ideal é se inscrever nos grupos específicos que o usuário participa
          this.stompClient.subscribe('/topic/group/*', (message: IMessage) => {
            this.messageSubject.next(JSON.parse(message.body));
          });
        }
      };

      this.stompClient.onStompError = (frame) => {
        console.error('Erro no broker: ' + frame.headers['message']);
        console.error('Detalhes: ' + frame.body);
      };

      this.stompClient.activate();
    }
  }

  disconnect(): void {
    if (this.stompClient && this.stompClient.active) {
      this.stompClient.deactivate();
      this.stompClient = null;
    }
  }

  sendMessage(chatMessage: ChatMessage): Observable<ChatMessage> {
    return this.http.post<ChatMessage>(`${CHAT_API_URL}/send-private`, chatMessage);
  }

  sendGroupMessage(chatMessage: ChatMessage): Observable<ChatMessage> {
    return this.http.post<ChatMessage>(`${CHAT_API_URL}/send-group`, chatMessage);
  }

  getMessages(): Observable<ChatMessage | null> {
    return this.messageSubject.asObservable();
  }

  getChatHistory(recipientUsername: string): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${CHAT_API_URL}/history/${recipientUsername}`);
  }

  getGroupChatHistory(groupId: string): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${CHAT_API_URL}/group-history/${groupId}`);
  }

  getConversations(): Observable<ConversationDto[]> {
    return this.http.get<ConversationDto[]>(`${CHAT_API_URL}/conversations`);
  }
}

