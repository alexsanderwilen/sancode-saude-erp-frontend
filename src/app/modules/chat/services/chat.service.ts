import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatMessage } from '../components/chat-room/chat-room.component';
import { ConversationDto } from '../models/conversation.model';

const WEBSOCKET_URL = '/ws-chat';
const CHAT_API_URL = '/api/chat';

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

      this.stompClient.webSocketFactory = () => {
        return new SockJS(`${WEBSOCKET_URL}?token=${token}`);
      };

      this.stompClient.configure({
        connectHeaders: {
          Authorization: `Bearer ${token}`
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      this.stompClient.onConnect = (frame) => {
        console.log('Conectado ao WebSocket: ' + frame);
        if (this.stompClient) {
          // Inscrição no tópico privado dinâmico para receber mensagens diretas
          const privateTopic = `/topic/private.${username}`;
          console.log(`Inscrevendo-se em: ${privateTopic}`);
          this.stompClient.subscribe(privateTopic, (message: IMessage) => {
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

  sendMessage(chatMessage: ChatMessage): void {
    if (this.stompClient && this.stompClient.active) {
      this.stompClient.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify(chatMessage)
      });
    }
  }

  sendGroupMessage(chatMessage: ChatMessage): void {
    if (this.stompClient && this.stompClient.active) {
      this.stompClient.publish({
        destination: '/app/chat.sendGroupMessage',
        body: JSON.stringify(chatMessage)
      });
    }
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
