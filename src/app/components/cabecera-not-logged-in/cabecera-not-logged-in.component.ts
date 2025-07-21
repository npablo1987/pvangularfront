import { Component, OnInit, Inject, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ClaveunicaService } from '../../services/claveunica.service';
import { SesionService } from '../../services/sesion.service';

@Component({
  selector: 'app-cabecera-not-logged-in',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './cabecera-not-logged-in.component.html',
  styleUrls: ['./cabecera-not-logged-in.component.css']
})
export class CabeceraNotLoggedInComponent implements OnInit {

  private nivelFuente = 0;            // 0-2
  private readonly maxFuente = 2;
  private readonly minFuente = 0;

  constructor(
    @Inject(DOCUMENT) private readonly doc: Document,
    private readonly renderer: Renderer2,
    private readonly claveUnicaService: ClaveunicaService,
    private readonly sesionSrv: SesionService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    const savedSize = Number(localStorage.getItem('nivelFuente'));
    if (!isNaN(savedSize)) { this.nivelFuente = savedSize; }

    if (localStorage.getItem('contraste') === '1') {
      this.renderer.addClass(this.doc.documentElement, 'a11y-contrast');
    }

    this.aplicarFuente();

    if (this.sesionSrv.getUsuario()) {
      void this.router.navigate(['/receptores/misfichas']);
    }
  }

  /* -------- Acciones UI -------- */
  onClaveUnicaLogin(): void { this.claveUnicaService.login(); }

  toggleContraste(ev: Event): void {
    ev.preventDefault();
    const html = this.doc.documentElement;
    const activo = html.classList.contains('a11y-contrast');

    if (activo) {
      this.renderer.removeClass(html, 'a11y-contrast');
      localStorage.setItem('contraste', '0');
    } else {
      this.renderer.addClass(html, 'a11y-contrast');
      localStorage.setItem('contraste', '1');
    }
  }

  cambiarTamanoFuente(dir: number, ev: Event): void {
    ev.preventDefault();
    const nuevo = Math.min(this.maxFuente,
                  Math.max(this.minFuente, this.nivelFuente + dir));
    if (nuevo === this.nivelFuente) { return; }

    this.nivelFuente = nuevo;
    localStorage.setItem('nivelFuente', String(nuevo));
    this.aplicarFuente();
  }

  /* -------- Helpers -------- */
  private aplicarFuente(): void {
    const html = this.doc.documentElement;
    ['a11y-font-0','a11y-font-1','a11y-font-2']
      .forEach(c => this.renderer.removeClass(html, c));
    this.renderer.addClass(html, `a11y-font-${this.nivelFuente}`);
  }
}
