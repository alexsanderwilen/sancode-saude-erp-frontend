import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatListModule, MatSelectionListChange } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { GroupService, GroupMember } from '../../services/group.service';
import { Usuario } from '@shared/models/usuario.model';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-remove-user-from-group-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatListModule, MatButtonModule],
  templateUrl: './remove-user-from-group-dialog.component.html',
})
export class RemoveUserFromGroupDialogComponent implements OnInit {
  members: GroupMember[] = [];
  selectedUsernames: string[] = [];
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

  onListSelectionChange(event: MatSelectionListChange): void {
    this.selectedUsernames = event.source.selectedOptions.selected.map(o => o.value as string);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onRemove(): void {
    this.dialogRef.close(this.selectedUsernames);
  }
}

