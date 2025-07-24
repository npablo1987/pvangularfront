import { Component, OnInit, Inject, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { CanActivate, Router } from '@angular/router';
import { SesionService } from '../../services/sesion.service';
@Component({
  selector: 'app-cabecera-logged',
  standalone: true,
  imports: [],
  templateUrl: './cabecera-logged.component.html',
  styleUrl: './cabecera-logged.component.css'
})
export class CabeceraLoggedComponent {

  private nivelFuente = 0;           
  private readonly maxFuente = 2;
  private readonly minFuente = 0;

  nombreUsuario = 'Usuario';

  constructor(
    @Inject(DOCUMENT) private readonly doc: Document,
    private readonly renderer: Renderer2,
    private router: Router,
    private sesionSrv: SesionService
  ) {
    const u = this.sesionSrv.getUsuario();
    if (u) {
      const datosPersonal = u.respuesta_xml?.documento?.datosPersonal;
      if (datosPersonal?.nombre?.nombres) {
        const primerNombre = datosPersonal.nombre.nombres
          .trim()
          .split(/\s+/)[0];
        const apPaterno = datosPersonal.nombre.apellidoPaterno || '';
        const apMaterno = datosPersonal.nombre.apellidoMaterno || '';
        this.nombreUsuario = `${primerNombre} ${apPaterno} ${apMaterno}`.trim();
      } else {
        this.nombreUsuario = u.rut_enviado;
      }
    }
  }

  ngOnInit(): void {
    const savedSize = Number(localStorage.getItem('nivelFuente'));
    if (!isNaN(savedSize)) { this.nivelFuente = savedSize; }

    if (localStorage.getItem('contraste') === '1') {
      this.renderer.addClass(this.doc.documentElement, 'a11y-contrast');
    }
    this.aplicarFuente();
  }

  logout() {
    this.sesionSrv.logout();
    this.router.navigate(['/login']);         // ajusta ruta
  }

  irfichasaprobadas() {
    this.router.navigate(['/receptores/fichasaprobadas']);
    console.log('Redirigiendo a fichasaprobadas ...');
  }


  irfichasrechazadas() {
    this.router.navigate(['/receptores/fichasrechazadas']);
    console.log('Redirigiendo a fichasrechazadas...');
  }

  fichasreceptores(){
    this.router.navigate(['/receptores/fichasreceptores']);
    console.log('Redirigiendo a fichasreceptores...');
  }
  misfichas(){
      this.router.navigate(['/receptores/misfichas']);
      console.log('Redirigiendo a fichasrechazadas...');
    }


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
