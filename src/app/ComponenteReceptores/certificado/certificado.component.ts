import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { ApirestIndapService } from '../../services/apirest-indap.service';
import { FichaselecionadaService } from '../../services/fichaselecionada.service';
import { SesionService } from '../../services/sesion.service';
import { MenuRevisionFichaComponent } from '../menu-revision-ficha/menu-revision-ficha.component';

@Component({
  selector: 'app-certificado',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MenuRevisionFichaComponent
  ],
  templateUrl: './certificado.component.html',
  styleUrl: './certificado.component.css'
})
export class CertificadoComponent implements OnInit {
  private api       = inject(ApirestIndapService);
  private fichaSrv  = inject(FichaselecionadaService);
  private session   = inject(SesionService);
  private sanitizer = inject(DomSanitizer);

  idFicha = 0;
  pdfUrl: SafeResourceUrl | null = null;
  pdfBlobUrl = '';

  ngOnInit(): void {
    console.log('[Certificado] ngOnInit iniciado...');

    const fichaCompleta = this.fichaSrv.fichaCompletaValue;
    if (!fichaCompleta) {
      console.warn('[Certificado] ❌ No hay ficha seleccionada. Redirigiendo o abortando carga.');
      return;
    }

    this.idFicha = fichaCompleta.ficha.id_ficha;
    console.log('[Certificado] ID Ficha:', this.idFicha);

    this.api.getCertificadoRFPmeta(this.idFicha).subscribe({
      next: () => {
        console.log('[Certificado] ✅ Certificado existe. Procediendo a descargar...');

        this.api.downloadCertificadoRFP(this.idFicha).subscribe({
          next: blob => {
            console.log('[Certificado] ✅ PDF descargado con éxito.');
            this.pdfBlobUrl = URL.createObjectURL(blob);
            this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfBlobUrl);
          },
          error: err => {
            console.error('[Certificado] ❌ Error al descargar el PDF:', err);
          }
        });
      },
      error: err => {
        if (err.status === 404) {
          console.warn('[Certificado] ⚠️ No existe certificado para esta ficha.');
        } else {
          console.error('[Certificado] ❌ Error inesperado al verificar existencia:', err);
        }
        this.pdfUrl = null;
      }
    });
  }
}
