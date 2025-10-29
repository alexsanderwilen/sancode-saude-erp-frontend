import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TissService } from '../services/tiss.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ans-tiss',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tiss-page.component.html',
  styleUrls: ['./tiss-page.component.css']
})
export class TissPageComponent {
  xml = '';
  resp: any;
  profile: string = 'arquivos_schemas_ans_tiss';
  constructor(private svc: TissService) {}
  validate() { this.svc.validate(this.xml, this.profile).subscribe(r => this.resp = r); }
  onFile(evt: any) {
    const f = evt.target?.files?.[0]; if (!f) return;
    this.svc.upload(f, this.profile).subscribe(r => this.resp = r);
  }
}

