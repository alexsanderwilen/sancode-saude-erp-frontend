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
import { Observable, forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

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
import { TipoPagamento } from '../../tipo-pagamento/tipo-pagamento.model';
import { TipoPagamentoService } from '../../tipo-pagamento/tipo-pagamento.service';
import { Acomodacao } from '../../acomodacao/acomodacao.model';
import { AcomodacaoService } from '../../acomodacao/acomodacao.service';
import { CoberturaAdicional } from '../../cobertura-adicional/cobertura-adicional.model';
import { CoberturaAdicionalService } from '../../cobertura-adicional/cobertura-adicional.service';
import { PlanoTiposPagamentoTabComponent } from '../tabs/plano-tipos-pagamento-tab.component';
import { PlanoAcomodacoesTabComponent } from '../tabs/plano-acomodacoes-tab.component';
import { PlanoCoberturasAdicionaisTabComponent } from '../tabs/plano-coberturas-adicionais-tab.component';

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
    MatNativeDateModule,
    PlanoTiposPagamentoTabComponent,
    PlanoAcomodacoesTabComponent,
    PlanoCoberturasAdicionaisTabComponent
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
  tiposPagamento$: Observable<TipoPagamento[]>;
  acomodacoes$: Observable<Acomodacao[]>;
  coberturas$: Observable<CoberturaAdicional[]>;

  // selections
  selectedTiposPagamento: number[] = [];
  selectedAcomodacoes: number[] = [];
  selectedCoberturas: number[] = [];

  constructor(
    private fb: FormBuilder,
    private planoService: PlanoService,
    private router: Router,
    private route: ActivatedRoute,
    private planoBaseService: PlanoBaseService,
    private planoStatusService: PlanoStatusService,
    private segmentacaoService: SegmentacaoAssistencialService,
    private abrangenciaService: AbrangenciaGeograficaService,
    private tipoContratacaoService: TipoContratacaoService,
    private tipoPagamentoService: TipoPagamentoService,
    private acomodacaoService: AcomodacaoService,
    private coberturaService: CoberturaAdicionalService
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
    this.tiposPagamento$ = this.tipoPagamentoService.getTiposPagamento();
    this.acomodacoes$ = this.acomodacaoService.getAcomodacoes();
    this.coberturas$ = this.coberturaService.getCoberturas();
  }

  ngOnInit(): void {
    this.planoId = this.route.snapshot.params['id'];
    if (this.planoId) {
      this.isEditMode = true;
      this.planoService.getPlano(this.planoId).pipe(
        switchMap(plano => {
          this.planoForm.patchValue(plano);
          return forkJoin([
            this.planoService.getTiposPagamentoByPlano(this.planoId!),
            this.planoService.getAcomodacoesByPlano(this.planoId!),
            this.planoService.getCoberturasByPlano(this.planoId!)
          ]);
        })
      ).subscribe(([tipos, acoms, cobs]) => {
        this.selectedTiposPagamento = tipos;
        this.selectedAcomodacoes = acoms;
        this.selectedCoberturas = cobs;
      });
    }
  }

  onSubmit(): void {
    if (!this.planoForm.valid) { return; }
    // Para edição, não enviamos relacionamentos (são geridos nas abas com endpoints próprios)
    // Para criação, enviamos os relacionamentos selecionados.
    const base: any = { ...this.planoForm.value };
    let save$;
    if (this.isEditMode && this.planoId) {
      save$ = this.planoService.updatePlano(this.planoId, base as Plano);
    } else {
      const createPayload: any = {
        ...base,
        tiposPagamentoIds: this.selectedTiposPagamento ?? [],
        acomodacoesIds: this.selectedAcomodacoes ?? [],
        coberturasAdicionaisIds: this.selectedCoberturas ?? []
      } as Plano;
      save$ = this.planoService.createPlano(createPayload);
    }

    save$.subscribe(() => {
      this.router.navigate(['/cadastros/planos']);
    });
  }
}
