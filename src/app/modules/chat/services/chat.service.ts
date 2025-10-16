import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatMessage } from '../components/chat-room/chat-room.component';

const WEBSOCKET_URL = 'http://localhost:8080/ws-chat'; // Endpoint do backend com SockJS
const TOPIC_PUBLIC = '/topic/public'; // Tópico para mensagens públicas

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private stompClient: Client;
  private messageSubject = new BehaviorSubject<ChatMessage | null>(null);

  constructor() {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(WEBSOCKET_URL),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.stompClient.onConnect = (frame) => {
      console.log('Conectado ao WebSocket: ' + frame);
      // Se inscreve no tópico público para receber mensagens
      this.stompClient.subscribe(TOPIC_PUBLIC, (message: IMessage) => {
        this.messageSubject.next(JSON.parse(message.body));
      });
    };

    this.stompClient.onStompError = (frame) => {
      console.error('Erro no broker: ' + frame.headers['message']);
      console.error('Detalhes: ' + frame.body);
    };
  }

  // Ativa a conexão e envia a mensagem de JOIN
  connect(username: string): void {
    if (!this.stompClient.active) {
      this.stompClient.activate();
      // Adiciona um listener para quando a conexão for estabelecida
      this.stompClient.onConnect = (frame) => {
        console.log('Conectado: ' + frame);
        this.stompClient.subscribe(TOPIC_PUBLIC, (message: IMessage) => {
          this.messageSubject.next(JSON.parse(message.body));
        });

        // Envia a mensagem de JOIN para o backend
        this.stompClient.publish({
          destination: '/app/chat.addUser',
          body: JSON.stringify({ sender: username, type: 'JOIN' })
        });
      };
    }
  }

  // Desconecta o cliente
  disconnect(): void {
    if (this.stompClient.active) {
      this.stompClient.deactivate();
    }
  }

  // Envia uma mensagem de CHAT
  sendMessage(chatMessage: ChatMessage): void {
    if (this.stompClient.active) {
      this.stompClient.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify(chatMessage)
      });
    }
  }

  // Retorna o Observable de mensagens
  getMessages(): Observable<ChatMessage | null> {
    return this.messageSubject.asObservable();
  }
}
