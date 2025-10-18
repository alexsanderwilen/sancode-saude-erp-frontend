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
import { Subscription, Observable } from 'rxjs';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '@core/services/auth.service';
import { Usuario } from '@shared/models/usuario.model';
import { UserService } from '@core/services/user.service';

// Componentes das abas
import { UserListComponent } from '../user-list/user-list.component';
import { ConversationListComponent } from '../conversation-list/conversation-list.component';
import { GroupListComponent } from '../group-list/group-list.component';

// A interface da mensagem agora precisa de um destinatário opcional
export interface ChatMessage {
  type: 'CHAT' | 'JOIN' | 'LEAVE';
  content?: string;
  sender: string;
  recipient?: string; // Adicionado para mensagens privadas
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
    TextFieldModule,
    UserListComponent,
    ConversationListComponent, // Adicionado o novo componente
    GroupListComponent
  ],
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss'],
  providers: [ChatService] // ChatService é provido aqui
})
export class ChatRoomComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  // Estado da Conexão e Usuário
  isConnected = false;
  username = '';

  // Estado do Painel de Mensagens
  messageInput = '';
  messages: ChatMessage[] = [];
  activeRecipient: Usuario | null = null;

  // Estado do Painel Lateral
  activeView: 'chats' | 'users' | 'groups' = 'chats';

  private subscriptions = new Subscription();
  private needsScroll = false;

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private userService: UserService // Injetado o UserService
  ) {}

  ngOnInit(): void {
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
        // Logs de depuração para o problema em tempo real
        if (message && this.activeRecipient) {
          console.log('Mensagem recebida:', message);
          console.log('Remetente:', message.sender);
          console.log('Destinatário Ativo:', this.activeRecipient.username);
        }

        // A mensagem só é adicionada se for da conversa atualmente ativa
        if (message && this.activeRecipient && message.sender === this.activeRecipient.username) {
          this.messages.push(message);
          this.needsScroll = true;
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

  // Conecta ao WebSocket e se inscreve na fila privada
  private connectToChat(): void {
    if (this.username && !this.isConnected) {
      this.chatService.connect(this.username);
      this.isConnected = true;
    }
  }

  // --- Controle de Visualização do Painel Lateral ---
  showChats(): void {
    this.activeView = 'chats';
  }

  showUsers(): void {
    this.activeView = 'users';
  }

  showGroups(): void {
    this.activeView = 'groups';
  }

  // --- Lógica de Conversa Ativa ---
  selectUser(user: Usuario): void {
    if (!user || user.username === this.username) return; // Não pode conversar consigo mesmo

    this.activeRecipient = user;
    this.messages = []; // Limpa as mensagens atuais
    this.activeView = 'chats'; // Muda para a aba de chat

    // Carrega o histórico da conversa com o usuário selecionado
    this.subscriptions.add(
      this.chatService.getChatHistory(user.username).subscribe(history => {
        this.messages = history;
        this.needsScroll = true;
      })
    );
  }

  selectUserByUsername(username: string): void {
    this.subscriptions.add(
      this.userService.getUserByUsername(username).subscribe(user => {
        if (user) {
          this.selectUser(user);
        }
      })
    );
  }

  sendMessage(): void {
    if (!this.messageInput.trim() || !this.activeRecipient) {
      return; // Não envia se não houver texto ou destinatário ativo
    }

    const message: ChatMessage = {
      type: 'CHAT',
      sender: this.username,
      recipient: this.activeRecipient.username,
      content: this.messageInput.trim()
    };

    // Envia a mensagem pelo serviço
    this.chatService.sendMessage(message);

    // Adiciona a mensagem à UI localmente para feedback instantâneo
    this.messages.push(message);
    this.needsScroll = true;
    this.messageInput = '';
  }

  onEnterPressed(event: any): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  private scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  ngOnDestroy(): void {
    this.chatService.disconnect();
    this.subscriptions.unsubscribe();
  }
}
