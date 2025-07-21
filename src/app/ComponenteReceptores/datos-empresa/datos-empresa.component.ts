import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuRevisionFichaComponent } from '../menu-revision-ficha/menu-revision-ficha.component';
import { ActivatedRoute } from '@angular/router';
import { FichaselecionadaService } from '../../services/fichaselecionada.service';
import { Router } from '@angular/router';
import { ApirestIndapService } from '../../services/apirest-indap.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-datos-empresa',
  standalone: true,
  imports: [CommonModule, MenuRevisionFichaComponent, ReactiveFormsModule],
  templateUrl: './datos-empresa.component.html',
  styleUrl: './datos-empresa.component.css'
})

export class DatosEmpresaComponent implements OnInit {
  private baseUrl = environment.baseurl;
  empresaForm: FormGroup;
  documentos: any[] = [];
  fichaCorta: any = null;
  fichaCompleta: any = null;

  constructor(
    private fb: FormBuilder,
    private fichaSrv: FichaselecionadaService,
    private apiService: ApirestIndapService,
    private router: Router 
  ) {
    this.empresaForm = this.fb.group({
      rut: [''],
      razonSocial: [''],
      tipoEmpresa: [''],
      personalidadJuridica: [''],
      otorgadoPor: [''],
      areaTematica: [''],
      exentoContabilidad: [false],
      patrimonio: [''],
      capitalSocial: [''],
      estadoResultado: ['']
    });
  }

  ngOnInit(): void {

    this.fichaCorta = this.fichaSrv.fichaSeleccionadaValue;
    console.log('Ficha corta recibida:', this.fichaCorta);

    if (!this.fichaCorta || !this.fichaCorta.id_ficha) {
      console.warn('No se seleccionó ninguna ficha.');
      return;
    }

    this.apiService.dataFichaCompleta(this.fichaCorta.id_ficha).subscribe({
      next: (resp) => {
        console.log('Ficha completa:', resp);
        
        this.fichaSrv.setFichaCompleta(resp);
        this.fichaCompleta = resp;

        if (resp.persona_juridica) {
          this.empresaForm.patchValue({
            rut: resp.persona_juridica.rut,
            razonSocial: resp.persona_juridica.nombre_razon_social,
            tipoEmpresa: resp.persona_juridica.tipo_empresa,
            personalidadJuridica: resp.persona_juridica.numero_pj,
            otorgadoPor: resp.persona_juridica.otorgado_por,
            areaTematica: resp.persona_juridica.area_tematica,
            patrimonio: resp.persona_juridica.patrimonio,
            capitalSocial: resp.persona_juridica.capital_social,
            estadoResultado: resp.persona_juridica.estado_resultado
          });
        }

        if (resp.documentos) {
          this.documentos = resp.documentos;
        }
      },
      error: (err) => {
        console.error('Error al obtener ficha completa:', err);
      }
    });
  }

  buildFileUrl(ruta: string): string {
    return `${this.baseUrl}uploads/${ruta}`;
  }
}