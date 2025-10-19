import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { GroupService } from '../../services/group.service';
import { Usuario } from '@shared/models/usuario.model';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-remove-user-from-group-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatListModule, MatCheckboxModule, MatButtonModule],
  templateUrl: './remove-user-from-group-dialog.component.html',
})
export class RemoveUserFromGroupDialogComponent implements OnInit {
  members: Usuario[] = [];
  selectedUsers: number[] = [];
  currentUsername: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<RemoveUserFromGroupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { groupId: string },
    private groupService: GroupService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUsername = this.authService.currentUserValue?.sub || null;
    this.loadMembers();
  }

  loadMembers(): void {
    this.groupService.getGroupById(this.data.groupId).subscribe(group => {
      this.members = group.members.filter(m => m.username !== this.currentUsername);
    });
  }

  onUserSelectionChange(event: any, userId: number): void {
    if (event.checked) {
      this.selectedUsers.push(userId);
    } else {
      const index = this.selectedUsers.indexOf(userId);
      if (index > -1) {
        this.selectedUsers.splice(index, 1);
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onRemove(): void {
    this.dialogRef.close(this.selectedUsers);
  }
}
