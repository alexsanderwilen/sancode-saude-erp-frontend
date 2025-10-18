import { Component, OnDestroy, OnInit, ViewChild, ElementRef, AfterViewChecked, inject } from '@angular/core';
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
import { ActivatedRoute, Router } from '@angular/router';
import { GroupService, ChatGroup } from '../../services/group.service';

// Componentes das abas
import { UserListComponent } from '../user-list/user-list.component';
import { ConversationListComponent } from '../conversation-list/conversation-list.component';
import { GroupListComponent } from '../group-list/group-list.component';

// A interface da mensagem agora precisa de um destinatário opcional
export interface ChatMessage {
  type: 'CHAT' | 'JOIN' | 'LEAVE' | 'GROUP'; // Adicionado tipo GROUP
  content?: string;
  sender: string;
  recipient?: string; // Pode ser username ou groupId
  createdAt?: string; // Adicionado para exibir o timestamp
  tempId?: string; // ID temporário para evitar duplicação na UI
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
    ConversationListComponent,
    GroupListComponent
  ],
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss'],
  providers: [ChatService] // ChatService é provido aqui
})
export class ChatRoomComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  // Injeções
  private chatService = inject(ChatService);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private router = inject(Router); // Injetando o Router
  private groupService = inject(GroupService);

  // Estado da Conexão e Usuário
  isConnected = false;
  username = '';

  // Estado do Painel de Mensagens
  messageInput = '';
  messages: ChatMessage[] = [];
  activeRecipientId: string | null = null; // Pode ser username ou groupId
  chatType: 'private' | 'group' | null = null;
  activeRecipientName: string | null = null; // Nome para exibir na UI

  // Estado do Painel Lateral
  activeView: 'chats' | 'users' | 'groups' = 'chats';

  private subscriptions = new Subscription();
  private needsScroll = false;

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
      this.chatService.getMessages().subscribe(receivedMessage => {
        if (receivedMessage) {
          console.log('Mensagem recebida pelo frontend:', receivedMessage);

          // Lógica para adicionar mensagens recebidas à conversa ativa
          const isPrivateMessageForActiveRecipient = receivedMessage.type === 'CHAT' && receivedMessage.sender === this.activeRecipientId;
          const isGroupMessageForActiveGroup = receivedMessage.type === 'GROUP' && receivedMessage.recipient === this.activeRecipientId;

          if (isPrivateMessageForActiveRecipient || isGroupMessageForActiveGroup) {
            this.messages.push(receivedMessage);
            console.log('Mensagem adicionada ao array:', receivedMessage);
            this.needsScroll = true;
          }
        }
      })
    );

    // Observa mudanças nos parâmetros da rota
    this.subscriptions.add(
      this.route.paramMap.subscribe(params => {
        this.chatType = params.get('type') as 'private' | 'group';
        this.activeRecipientId = params.get('id');
        this.messages = []; // Limpa mensagens ao mudar de conversa

        if (this.activeRecipientId && this.chatType) {
          this.loadChatHistory(this.chatType, this.activeRecipientId);
          this.loadRecipientName(this.chatType, this.activeRecipientId);
        }
      })
    );
  }

  ngAfterViewChecked(): void {
    if (this.needsScroll) {
      console.log('ngAfterViewChecked: needsScroll é true, chamando scrollToBottom.');
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

  private loadChatHistory(type: 'private' | 'group', id: string): void {
    if (type === 'private') {
      this.subscriptions.add(
        this.chatService.getChatHistory(id).subscribe(history => {
          this.messages = history;
          this.needsScroll = true;
        })
      );
    } else if (type === 'group') {
      this.subscriptions.add(
        this.chatService.getGroupChatHistory(id).subscribe(history => {
          this.messages = history;
          this.needsScroll = true;
        })
      );
    }
  }

  private loadRecipientName(type: 'private' | 'group', id: string): void {
    if (type === 'private') {
      this.activeRecipientName = id;
    } else if (type === 'group') {
      // Buscar o nome do grupo pelo ID
      this.subscriptions.add(
        this.groupService.getGroupById(id).subscribe(group => {
          this.activeRecipientName = group.name;
        })
      );
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

    this.router.navigate(['/chat/sala', 'private', user.username]);
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
    if (!this.messageInput.trim() || !this.activeRecipientId || !this.chatType) {
      return; // Não envia se não houver texto, destinatário ativo ou tipo de chat
    }

    const messageToSend: ChatMessage = {
      type: this.chatType === 'private' ? 'CHAT' : 'GROUP',
      sender: this.username,
      recipient: this.activeRecipientId,
      content: this.messageInput.trim()
    };

    // Adiciona a mensagem à UI localmente para feedback instantâneo
    const localMessage: ChatMessage = {
      ...messageToSend,
      tempId: Date.now().toString() + Math.random().toString(36).substring(2, 9), // Gera um ID temporário único
      createdAt: new Date().toISOString() // Adiciona timestamp local para exibição imediata
    };
    this.messages.push(localMessage);
    this.needsScroll = true;
    const messageInputBeforeClear = this.messageInput; // Salva o input antes de limpar
    this.messageInput = '';

    let sendObservable: Observable<ChatMessage>;
    if (this.chatType === 'private') {
      sendObservable = this.chatService.sendMessage(messageToSend);
    } else if (this.chatType === 'group') {
      sendObservable = this.chatService.sendGroupMessage(messageToSend);
    } else {
      return; // Tipo de chat inválido
    }

    this.subscriptions.add(
      sendObservable.subscribe({
        next: (savedMessage) => {
          // Encontra a mensagem local pelo tempId e a substitui pela mensagem salva do backend
          const index = this.messages.findIndex(m => m.tempId === localMessage.tempId);
          if (index !== -1) {
            this.messages[index] = savedMessage;
            this.needsScroll = true;
          }
        },
        error: (err) => {
          console.error('Erro ao enviar mensagem:', err);
          // Opcional: remover a mensagem local ou marcar como falha
          const index = this.messages.findIndex(m => m.tempId === localMessage.tempId);
          if (index !== -1) {
            this.messages.splice(index, 1); // Remove a mensagem local em caso de erro
          }
          this.messageInput = messageInputBeforeClear; // Restaura o input para o usuário tentar novamente
        }
      })
    );
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
