import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable } from 'rxjs';
import { GroupService, ChatGroup } from '../../services/group.service';

@Component({
  selector: 'app-group-list',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss']
})
export class GroupListComponent implements OnInit {
  private groupService = inject(GroupService);

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

  createTestGroup(): void {
    const groupName = `Novo Grupo ${Date.now()}`;
    const description = 'Grupo de teste criado automaticamente.';
    this.groupService.createGroup(groupName, description).subscribe(() => {
      this.loadGroups(); // Recarrega a lista após criar
    });
  }
}
