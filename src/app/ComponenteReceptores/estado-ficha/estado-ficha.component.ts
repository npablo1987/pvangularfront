/* ─ estado-ficha.component.ts ────────────────────────── */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuRevisionFichaComponent } from '../menu-revision-ficha/menu-revision-ficha.component';
import { FichaselecionadaService } from '../../services/fichaselecionada.service';
import { ApirestIndapService } from '../../services/apirest-indap.service';

@Component({
  selector: 'app-estado-ficha',
  standalone: true,
  imports: [CommonModule, MenuRevisionFichaComponent],
  templateUrl: './estado-ficha.component.html',
  styleUrls: ['./estado-ficha.component.css']
})
export class EstadoFichaComponent implements OnInit {

  historial: any[] = [];
  selectedFile!: File;
  subiendo = false;
  mensaje = '';

  private idFicha!: number;               // para llamar al endpoint

  constructor(
    private fichaSrv: FichaselecionadaService,
    private api: ApirestIndapService
  ) {}

  ngOnInit(): void {
    const fichaCompleta = this.fichaSrv.fichaCompletaValue;
    this.historial = fichaCompleta?.historial ?? [];
    this.idFicha   = fichaCompleta?.ficha?.id_ficha;
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      this.mensaje = '';
    }
  }

  subirCertificado() {
    if (!this.selectedFile || !this.idFicha || this.subiendo) { return; }

    this.subiendo = true;
    this.api.uploadRegistro1986(this.idFicha, this.selectedFile)
      .subscribe({
        next: res => {
          this.mensaje = '✅ Certificado cargado correctamente';
          this.subiendo = false;
          // opcional: refrescar historial o documentos
        },
        error: err => {
          console.error(err);
          this.mensaje = '❌ Error: ' + (err.error?.detail || 'no se pudo subir');
          this.subiendo = false;
        }
      });
  }
}
