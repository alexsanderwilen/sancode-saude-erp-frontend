import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserProfileMenuComponent } from '../../../../shared/components/user-profile-menu/user-profile-menu.component';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-chat-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    UserProfileMenuComponent
  ],
  templateUrl: './chat-layout.component.html',
  styleUrls: ['./chat-layout.component.scss']
})
export class ChatLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  navigateToMyChatRoom(): void {
    const currentUser = this.authService.currentUserValue;
    if (currentUser && currentUser.sub) {
      this.router.navigate(['/chat/sala', 'private', currentUser.sub]);
    } else {
      // Opcional: redirecionar para a home do chat ou exibir uma mensagem de erro
      this.router.navigate(['/chat/home']);
    }
  }
}
