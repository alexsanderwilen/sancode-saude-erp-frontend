import { Component, OnInit, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable } from 'rxjs';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-conversation-list',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './conversation-list.component.html',
  styleUrls: ['./conversation-list.component.scss']
})
export class ConversationListComponent implements OnInit {
  private chatService = inject(ChatService);

  @Output() conversationSelected = new EventEmitter<string>();

  conversations$!: Observable<string[]>;
  isLoading = true;

  ngOnInit(): void {
    this.loadConversations();
  }

  loadConversations(): void {
    this.isLoading = true;
    this.conversations$ = this.chatService.getConversations();
    this.conversations$.subscribe(() => this.isLoading = false);
  }

  onConversationClick(username: string): void {
    this.conversationSelected.emit(username);
  }
}
