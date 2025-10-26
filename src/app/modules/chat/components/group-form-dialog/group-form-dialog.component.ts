
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { UserService } from '../../../../core/services/user.service';
import { Usuario } from '../../../../shared/models/usuario.model';
import { GroupService } from '../../services/group.service';

@Component({
  selector: 'app-group-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './group-form-dialog.component.html',
  styleUrls: ['./group-form-dialog.component.scss']
})
export class GroupFormDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private groupService = inject(GroupService);
  public dialogRef = inject(MatDialogRef<GroupFormDialogComponent>);

  groupForm!: FormGroup;
  users$!: Observable<Usuario[]>;

  ngOnInit(): void {
    this.groupForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      members: [[], Validators.required]
    });

    this.loadUsers();
  }

  loadUsers(): void {
    this.users$ = this.userService.getAllUsersUnpaged();
  }

  onSubmit(): void {
    if (this.groupForm.valid) {
      const { name, description, members } = this.groupForm.value;
      this.groupService.createGroup(name, description, members).subscribe(() => {
        this.dialogRef.close(true); // Close dialog and indicate success
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

