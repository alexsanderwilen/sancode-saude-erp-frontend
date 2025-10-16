import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../../../core/services/auth.service'; // Importar o AuthService

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
    MatIconModule
  ],
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss'],
  providers: [ChatService]
})
export class ChatRoomComponent implements OnInit, OnDestroy {
  isConnected = false;
  username = '';
  messageInput = '';
  messages: ChatMessage[] = [];
  private subscriptions = new Subscription();

  constructor(
    private chatService: ChatService,
    private authService: AuthService // Injetar o AuthService
  ) {}

  ngOnInit(): void {
    // Se inscreve para receber o usuário atual
    this.subscriptions.add(
      this.authService.currentUser.subscribe(user => {
        if (user && user.sub) {
          this.username = user.sub; // 'sub' geralmente contém o username no JWT
          this.connectToChat();
        }
      })
    );

    // Se inscreve para receber mensagens do chat
    this.subscriptions.add(
      this.chatService.getMessages().subscribe(message => {
        if (message) {
          this.messages.push(message);
        }
      })
    );
  }

  private connectToChat(): void {
    if (this.username && !this.isConnected) {
      this.chatService.connect(this.username);
      this.isConnected = true;
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

  ngOnDestroy(): void {
    this.chatService.disconnect();
    this.subscriptions.unsubscribe();
  }
}
