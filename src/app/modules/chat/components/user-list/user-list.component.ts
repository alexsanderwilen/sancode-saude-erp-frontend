import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable } from 'rxjs';
import { Page } from '@shared/models/page.model';
import { Usuario } from '@shared/models/usuario.model';
import { UserService } from '@core/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);

  users$!: Observable<Page<Usuario>>;
  isLoading = true;

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.users$ = this.userService.getAllUsers();
    this.users$.subscribe(() => this.isLoading = false);
  }

  onUserClick(user: Usuario): void {
    this.router.navigate(['/chat/sala', 'private', user.username]);
  }
}
