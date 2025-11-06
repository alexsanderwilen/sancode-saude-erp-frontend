export interface ChatMessage {
  type: 'CHAT' | 'JOIN' | 'LEAVE' | 'GROUP';
  content?: string;
  sender: string;
  recipient?: string; // username ou groupId
  createdAt?: string;
  tempId?: string;
  attachment?: { id: number; filename?: string; contentType?: string; size?: number };
}

