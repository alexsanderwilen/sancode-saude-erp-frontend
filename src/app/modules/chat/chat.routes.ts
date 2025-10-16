import { Routes } from '@angular/router';
import { ChatRoomComponent } from './components/chat-room/chat-room.component';

export const CHAT_ROUTES: Routes = [
  {
    path: '',
    component: ChatRoomComponent,
    title: 'Sancode Health - Chat'
  }
];
