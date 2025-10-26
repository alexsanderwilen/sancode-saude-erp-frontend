import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable } from 'rxjs';
import { GroupService, ChatGroup } from '../../services/group.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { GroupFormDialogComponent } from '../group-form-dialog/group-form-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-group-list',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss']
})
export class GroupListComponent implements OnInit {
  private groupService = inject(GroupService);
  private dialog = inject(MatDialog);
  private router = inject(Router);

  groups$!: Observable<ChatGroup[]>;
  isLoading = true;

  ngOnInit(): void {
    this.loadGroups();
  }

  loadGroups(): void {
    this.isLoading = true;
    this.groups$ = this.groupService.getMyGroups();
    this.groups$.subscribe(() => this.isLoading = false);
  }

  openCreateGroupDialog(): void {
    const dialogRef = this.dialog.open(GroupFormDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadGroups(); // Recarrega a lista se o grupo foi criado com sucesso
      }
    });
  }

  onGroupClick(group: ChatGroup): void {
    this.router.navigate(['/chat/sala', 'group', group.id]);
  }
}

