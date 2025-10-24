import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PlanoService } from '../plano.service';
import { Plano } from '../plano.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Observable } from 'rxjs';

// Import new models and services
import { PlanoBase } from '../../plano-base/plano-base.model';
import { PlanoBaseService } from '../../plano-base/plano-base.service';
import { PlanoStatus } from '../../plano-status/plano-status.model';
import { PlanoStatusService } from '../../plano-status/plano-status.service';
import { SegmentacaoAssistencial } from '../../segmentacao-assistencial/segmentacao-assistencial.model';
import { SegmentacaoAssistencialService } from '../../segmentacao-assistencial/segmentacao-assistencial.service';
import { AbrangenciaGeografica } from '../../abrangencia-geografica/abrangencia-geografica.model';
import { AbrangenciaGeograficaService } from '../../abrangencia-geografica/abrangencia-geografica.service';
import { TipoContratacao } from '../../tipo-contratacao/tipo-contratacao.model';
import { TipoContratacaoService } from '../../tipo-contratacao/tipo-contratacao.service';

@Component({
  selector: 'app-plano-form',
  templateUrl: './plano-form.component.html',
  styleUrls: ['./plano-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterModule,
    MatCardModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule, 
    MatButtonModule, 
    MatCheckboxModule,
    MatTabsModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class PlanoFormComponent implements OnInit {

  planoForm: FormGroup;
  isEditMode = false;
  planoId: number | null = null;

  // Observables for dropdowns
  planosBase$: Observable<PlanoBase[]>;
  segmentacoes$: Observable<SegmentacaoAssistencial[]>;
  abrangencias$: Observable<AbrangenciaGeografica[]>;
  tiposContratacao$: Observable<TipoContratacao[]>;
  status$: Observable<PlanoStatus[]>;

  constructor(
    private fb: FormBuilder,
    private planoService: PlanoService,
    private router: Router,
    private route: ActivatedRoute,
    private planoBaseService: PlanoBaseService,
    private planoStatusService: PlanoStatusService,
    private segmentacaoService: SegmentacaoAssistencialService,
    private abrangenciaService: AbrangenciaGeograficaService,
    private tipoContratacaoService: TipoContratacaoService
  ) {
    this.planoForm = this.fb.group({
      id: [null],
      nomeComercial: ['', Validators.required],
      registroAns: [''],
      idPlanoBase: [null, Validators.required],
      idSegmentacao: [null, Validators.required],
      idAbrangencia: [null, Validators.required],
      idTipoContratacao: [null, Validators.required],
      idPlanoStatus: [null, Validators.required],
      possuiCoparticipacao: [false],
      percentualCoparticipacao: [null],
      franquiaValor: [null],
      valorMensalidade: [null],
      dataInicioVigencia: [null, Validators.required],
      dataFimVigencia: [null],
      ativo: [true]
    });

    this.planosBase$ = this.planoBaseService.getPlanosBase();
    this.segmentacoes$ = this.segmentacaoService.getSegmentacoes();
    this.abrangencias$ = this.abrangenciaService.getAbrangencias();
    this.tiposContratacao$ = this.tipoContratacaoService.getTiposContratacao();
    this.status$ = this.planoStatusService.getPlanosStatus();
  }

  ngOnInit(): void {
    this.planoId = this.route.snapshot.params['id'];
    if (this.planoId) {
      this.isEditMode = true;
      this.planoService.getPlano(this.planoId).subscribe(plano => {
        this.planoForm.patchValue(plano);
      });
    }
  }

  onSubmit(): void {
    if (this.planoForm.valid) {
      const plano: Plano = this.planoForm.value;
      if (this.isEditMode && this.planoId) {
        this.planoService.updatePlano(this.planoId, plano).subscribe(() => {
          this.router.navigate(['/cadastros/planos']);
        });
      } else {
        this.planoService.createPlano(plano).subscribe(() => {
          this.router.navigate(['/cadastros/planos']);
        });
      }
    }
  }
}
