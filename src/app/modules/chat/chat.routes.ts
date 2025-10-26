import { Routes } from '@angular/router';
import { ChatLayoutComponent } from './components/chat-layout/chat-layout.component';
import { ChatHomeComponent } from './components/chat-home/chat-home.component';
import { ChatRoomComponent } from './components/chat-room/chat-room.component';

export const CHAT_ROUTES: Routes = [
  {
    path: '',
    component: ChatLayoutComponent,
    children: [
      {
        path: 'home',
        component: ChatHomeComponent,
        title: 'Sancode Health - Chat'
      },
      {
        path: 'sala/:type/:id',
        component: ChatRoomComponent,
        title: 'Sancode Health - Sala de Chat'
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  }
];

