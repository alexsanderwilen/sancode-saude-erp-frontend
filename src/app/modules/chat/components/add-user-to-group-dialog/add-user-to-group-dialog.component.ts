import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatListModule, MatSelectionListChange } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '@core/services/user.service';
import { GroupService } from '../../services/group.service';
import { Usuario } from '@shared/models/usuario.model';
import { forkJoin, map } from 'rxjs';

@Component({
  selector: 'app-add-user-to-group-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatListModule, MatButtonModule],
  templateUrl: './add-user-to-group-dialog.component.html',
})
export class AddUserToGroupDialogComponent implements OnInit {
  users: Usuario[] = [];
  selectedUsernames: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddUserToGroupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { groupId: string },
    private userService: UserService,
    private groupService: GroupService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    forkJoin({
      allUsers: this.userService.getAllUsers(),
      group: this.groupService.getGroupById(this.data.groupId)
    }).pipe(
      map(({ allUsers, group }) => {
        const memberUsernames = new Set(group.members.map((m: any) => m.username));
        return allUsers.content.filter((u: Usuario) => !memberUsernames.has(u.username));
      })
    ).subscribe(filteredUsers => {
      this.users = filteredUsers;
    });
  }

  onListSelectionChange(event: MatSelectionListChange): void {
    this.selectedUsernames = event.source.selectedOptions.selected.map(o => o.value as string);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onAdd(): void {
    this.dialogRef.close(this.selectedUsernames);
  }
}

