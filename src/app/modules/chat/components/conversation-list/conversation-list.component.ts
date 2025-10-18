import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable } from 'rxjs';
import { ChatService } from '../../services/chat.service';
import { Router } from '@angular/router';
import { ConversationDto } from '../../models/conversation.model';

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
  private router = inject(Router);

  conversations$!: Observable<ConversationDto[]>;
  isLoading = true;

  ngOnInit(): void {
    this.loadConversations();
  }

  loadConversations(): void {
    this.isLoading = true;
    this.conversations$ = this.chatService.getConversations();
    this.conversations$.subscribe(() => this.isLoading = false);
  }

  onConversationClick(conversation: ConversationDto): void {
    this.router.navigate(['/chat/sala', conversation.type, conversation.id]);
  }
}
