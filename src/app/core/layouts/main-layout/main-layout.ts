import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { filter } from 'rxjs/operators';

import { UserProfileMenuComponent } from '../../../shared/components/user-profile-menu/user-profile-menu.component';
import { UnreadNotificationService, UnreadSummaryDto } from '../../services/unread-notification.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
    UserProfileMenuComponent
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss'
})
export class MainLayoutComponent {

  isChatRoute = false;
  isModuleRoute = false;
  unread: UnreadSummaryDto = { total: 0, conversations: [] };

  constructor(
    private router: Router,
    private unreadSvc: UnreadNotificationService
  ) {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const url = event.urlAfterRedirects;
      this.isChatRoute = url.startsWith('/chat');
      this.isModuleRoute = url.startsWith('/cadastros') || url.startsWith('/usuarios') || url.startsWith('/chat');
    });

    // conectar notificações e assinar contagem
    this.unreadSvc.connect();
    this.unreadSvc.getSummary().subscribe(s => this.unread = s);
  }
}


