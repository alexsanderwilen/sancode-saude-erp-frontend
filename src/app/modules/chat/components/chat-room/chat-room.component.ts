import { Component, OnDestroy, OnInit, ViewChild, ElementRef, AfterViewChecked, inject, CUSTOM_ELEMENTS_SCHEMA, HostListener } from '@angular/core';
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
import { switchMap } from 'rxjs/operators';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '@core/services/auth.service';
import { Usuario } from '@shared/models/usuario.model';
import { UserService } from '@core/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupService, ChatGroup } from '../../services/group.service';

import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { AttachmentService } from '../../services/attachment.service';

// Componentes das abas
import { UserListComponent } from '../user-list/user-list.component';
import { ConversationListComponent } from '../conversation-list/conversation-list.component';
import { GroupListComponent } from '../group-list/group-list.component';
import { AddUserToGroupDialogComponent } from '../add-user-to-group-dialog/add-user-to-group-dialog.component';
import { RemoveUserFromGroupDialogComponent } from '../remove-user-from-group-dialog/remove-user-from-group-dialog.component';

// Mensagem do chat (texto ou com anexo)
export interface ChatMessage {
  type: 'CHAT' | 'JOIN' | 'LEAVE' | 'GROUP';
  content?: string;
  sender: string;
  recipient?: string; // username ou groupId
  createdAt?: string;
  tempId?: string;
  attachment?: { id: number; filename?: string; contentType?: string; size?: number };
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
    GroupListComponent,
    MatMenuModule
  ],
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss'],
  providers: [ChatService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ChatRoomComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  // Injeções
  private chatService = inject(ChatService);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private groupService = inject(GroupService);
  private dialog = inject(MatDialog);
  private attachmentService = inject(AttachmentService);

  // Estado
  isConnected = false;
  username = '';
  messageInput = '';
  messages: ChatMessage[] = [];
  activeRecipientId: string | null = null; // username ou groupId
  chatType: 'private' | 'group' | null = null;
  activeRecipientName: string | null = null;
  activeView: 'chats' | 'users' | 'groups' = 'chats';
  private subscriptions = new Subscription();
  private needsScroll = false;
  showEmojiPicker = false;

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
          const isPrivate = receivedMessage.type === 'CHAT' &&
            ((receivedMessage.sender === this.username && receivedMessage.recipient === this.activeRecipientId) ||
             (receivedMessage.sender === this.activeRecipientId && receivedMessage.recipient === this.username));

          const isGroup = receivedMessage.type === 'GROUP' && receivedMessage.recipient === this.activeRecipientId;

          if (isPrivate || isGroup) {
            const exists = this.messages.find(m => m.tempId && m.content === receivedMessage.content);
            if (!exists) {
              this.messages.push(receivedMessage);
              this.needsScroll = true;
            }
          }
        }
      })
    );

    this.subscriptions.add(
      this.route.paramMap.subscribe(params => {
        this.chatType = params.get('type') as 'private' | 'group';
        this.activeRecipientId = params.get('id');
        if (this.chatType && this.activeRecipientId) {
          this.loadChatHistory(this.chatType, this.activeRecipientId);
          this.loadRecipientName(this.chatType, this.activeRecipientId);
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

  // Conecta ao WebSocket
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
    } else {
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
    } else {
      this.subscriptions.add(
        this.groupService.getGroupById(id).subscribe(group => {
          this.activeRecipientName = group.name;
        })
      );
    }
  }

  // Sidebar view
  showChats(): void { this.activeView = 'chats'; }
  showUsers(): void { this.activeView = 'users'; }
  showGroups(): void { this.activeView = 'groups'; }

  // Seleção de usuário
  selectUser(user: Usuario): void {
    if (!user || user.username === this.username) return;
    this.router.navigate(['/chat/sala', 'private', user.username]);
  }

  selectUserByUsername(username: string): void {
    this.subscriptions.add(
      this.userService.getUserByUsername(username).subscribe(user => {
        if (user) this.selectUser(user);
      })
    );
  }

  // Envio de mensagem de texto
  sendMessage(): void {
    if (!this.messageInput.trim() || !this.activeRecipientId || !this.chatType) return;

    const messageToSend: ChatMessage = {
      type: this.chatType === 'private' ? 'CHAT' : 'GROUP',
      sender: this.username,
      recipient: this.activeRecipientId,
      content: this.messageInput.trim()
    };

    const localMessage: ChatMessage = {
      ...messageToSend,
      tempId: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString()
    };
    this.messages.push(localMessage);
    this.needsScroll = true;
    const beforeClear = this.messageInput;
    this.messageInput = '';

    let send$: Observable<ChatMessage>;
    send$ = this.chatType === 'private' ? this.chatService.sendMessage(messageToSend) : this.chatService.sendGroupMessage(messageToSend);

    this.subscriptions.add(send$.subscribe({
      next: saved => {
        const idx = this.messages.findIndex(m => m.tempId === localMessage.tempId);
        if (idx !== -1) { this.messages[idx] = saved; this.needsScroll = true; }
      },
      error: _err => {
        const idx = this.messages.findIndex(m => m.tempId === localMessage.tempId);
        if (idx !== -1) this.messages.splice(idx, 1);
        this.messageInput = beforeClear;
      }
    }));
  }

  onEnterPressed(event: any): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  // Emoji picker
  onEmojiClick(ev: any): void {
    try {
      const emoji = ev?.detail?.unicode || ev?.emoji?.native || '';
      if (emoji) this.messageInput = (this.messageInput || '') + emoji;
    } catch {}
  }

  toggleEmojiPicker(event: Event): void {
    event.stopPropagation();
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(_: MouseEvent): void {
    if (this.showEmojiPicker) this.showEmojiPicker = false;
  }

  openAddUserDialog(): void {
    const dialogRef = this.dialog.open(AddUserToGroupDialogComponent, {
      width: '400px',
      data: { groupId: this.activeRecipientId },
    });
    dialogRef.afterClosed().subscribe((result: string[]) => {
      if (result && result.length > 0) {
        result.forEach((username: string) => {
          this.groupService.addUserToGroupByUsername(this.activeRecipientId!, username).subscribe();
        });
      }
    });
  }

  openRemoveUserDialog(): void {
    const dialogRef = this.dialog.open(RemoveUserFromGroupDialogComponent, {
      width: '400px',
      data: { groupId: this.activeRecipientId },
    });
    dialogRef.afterClosed().subscribe((result: string[]) => {
      if (result && result.length > 0) {
        result.forEach((username: string) => {
          this.groupService.removeUserFromGroupByUsername(this.activeRecipientId!, username).subscribe();
        });
      }
    });
  }

  // Anexos de arquivo
  triggerFile(): void {
    const el = document.getElementById('fileInput') as HTMLInputElement | null;
    el?.click();
  }

  onFileSelected(event: any): void {
    const file: File | undefined = event?.target?.files?.[0];
    event.target.value = '';
    if (!file || !this.activeRecipientId || !this.chatType) return;

    const tempId = Date.now().toString() + Math.random().toString(36).substring(2, 9);
    const localMessage: ChatMessage = {
      type: this.chatType === 'private' ? 'CHAT' : 'GROUP',
      sender: this.username,
      recipient: this.activeRecipientId,
      content: '',
      createdAt: new Date().toISOString(),
      tempId,
      attachment: { filename: file.name, contentType: file.type, size: file.size } as any
    };
    this.messages.push(localMessage);
    this.needsScroll = true;

    this.attachmentService.uploadDirect(file).subscribe({
      next: (resp) => {
        const msg: any = {
          type: this.chatType === 'private' ? 'CHAT' : 'GROUP',
          sender: this.username,
          recipient: this.activeRecipientId,
          content: '',
          
attachment: { id: resp.id, filename: resp.filename, contentType: resp.contentType, size: resp.size }
        };
        const send$ = this.chatType === 'private' ? this.chatService.sendMessage(msg) : this.chatService.sendGroupMessage(msg);
        this.subscriptions.add(send$.subscribe({
          next: saved => {
            const idx = this.messages.findIndex(m => m.tempId === tempId);
            if (idx !== -1) { this.messages[idx] = saved; this.needsScroll = true; }
          },
          error: _err => {
            const idx = this.messages.findIndex(m => m.tempId === tempId);
            if (idx !== -1) this.messages.splice(idx, 1);
          }
        }));
      },
      error: _err => {
        const idx = this.messages.findIndex(m => m.tempId === tempId);
        if (idx !== -1) this.messages.splice(idx, 1);
      }
    });
  }

  downloadAttachment(id?: number): void {
    if (!id) return;
    // Baixa inline abrindo em nova aba (usa JWT via HttpClient e Blob)
    this.attachmentService.getContentResponse(id, 'inline').subscribe({
      next: (res) => {
        const blobUrl = URL.createObjectURL(res.body as Blob);
        window.open(blobUrl, '_blank');
        // URL.revokeObjectURL pode ser chamado depois de algum tempo/opção
        setTimeout(() => URL.revokeObjectURL(blobUrl), 30_000);
      }
    });
  }

  saveAttachment(id?: number): void {
    if (!id) return;
    // Força download criando um link temporário com Blob
    this.attachmentService.getContentResponse(id, 'attachment').subscribe({
      next: (res) => {
        const blobUrl = URL.createObjectURL(res.body as Blob);
        // tenta extrair filename dos headers
        const cd = res.headers.get('Content-Disposition') || '';
        const match = cd.match(/filename="?([^";]+)"?/i);
        const filename = match ? match[1] : 'arquivo';
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 10_000);
      }
    });
  }

  private scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch {}
  }

  ngOnDestroy(): void {
    this.chatService.disconnect();
    this.subscriptions.unsubscribe();
  }
}





