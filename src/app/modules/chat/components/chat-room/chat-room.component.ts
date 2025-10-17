import { Component, OnDestroy, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TextFieldModule } from '@angular/cdk/text-field';
import { Subscription } from 'rxjs';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../../../core/services/auth.service';

// Interface para a mensagem de chat
export interface ChatMessage {
  type: 'CHAT' | 'JOIN' | 'LEAVE';
  content?: string;
  sender: string;
}

@Component({
  selector: 'app-chat-room',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TextFieldModule
  ],
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss'],
  providers: [ChatService]
})
export class ChatRoomComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  isConnected = false;
  username = '';
  messageInput = '';
  messages: ChatMessage[] = [];
  conversations: any[] = []; // Placeholder for conversation list
  activeConversationId = '1'; // Placeholder

  private subscriptions = new Subscription();
  private needsScroll = false;

  constructor(
    private chatService: ChatService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadConversations(); // Carrega conversas de exemplo

    this.subscriptions.add(
      this.authService.currentUser.subscribe(user => {
        if (user && user.sub) {
          this.username = user.sub;
          this.connectToChat();
        }
      })
    );

    this.subscriptions.add(
      this.chatService.getMessages().subscribe(message => {
        if (message) {
          this.messages.push(message);
          this.needsScroll = true; // Marca que a rolagem é necessária
        }
      })
    );
  }

  ngAfterViewChecked(): void {
    if (this.needsScroll) {
      this.scrollToBottom();
      this.needsScroll = false;
    }
  }

  private connectToChat(): void {
    if (this.username && !this.isConnected) {
      // Primeiro, busca o histórico de mensagens
      this.subscriptions.add(
        this.chatService.getChatHistory("public-chat").subscribe({
          next: (historyMessages) => {
            this.messages = historyMessages; // Limpa e carrega o histórico
            this.needsScroll = true;
            // Após carregar o histórico, ativa a conexão WebSocket
            this.chatService.connect(this.username);
            this.isConnected = true;
          },
          error: (err) => {
            console.error('Erro ao carregar histórico de chat:', err);
            // Tenta conectar mesmo sem histórico, ou mostra erro
            this.chatService.connect(this.username);
            this.isConnected = true;
          }
        })
      );
    }
  }

  sendMessage(): void {
    if (this.messageInput.trim() && this.username) {
      const message: ChatMessage = {
        type: 'CHAT',
        sender: this.username,
        content: this.messageInput.trim()
      };
      this.chatService.sendMessage(message);
      this.messageInput = '';
    }
  }

  onEnterPressed(event: any): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Previne a quebra de linha
      this.sendMessage();
    }
  }

  private scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  private loadConversations(): void {
    // Dados de exemplo para a lista de conversas
    this.conversations = [
      {
        id: '1',
        name: 'Sala Principal',
        lastMessage: 'Bem-vindo à sala principal!',
        timestamp: '10:30',
        unreadCount: 2
      },
      {
        id: '2',
        name: 'Equipe de Vendas',
        lastMessage: 'Relatório mensal enviado.',
        timestamp: 'Ontem',
        unreadCount: 0
      },
      {
        id: '3',
        name: 'João da Silva',
        lastMessage: 'Ok, obrigado!',
        timestamp: '2d atrás',
        unreadCount: 0
      }
    ];
  }

  ngOnDestroy(): void {
    this.chatService.disconnect();
    this.subscriptions.unsubscribe();
  }
}
