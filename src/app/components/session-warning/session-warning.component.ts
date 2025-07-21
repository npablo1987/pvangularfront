/* ─ session-warning.component.ts ─────────────────────── */
import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';          // 👈
import { SesionService } from '../../services/sesion.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-session-warning',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div *ngIf="visible" class="modal-backdrop">
    <div class="modal-box">
      <p>Tu sesión está por expirar.<br>¿Deseas continuar?</p>
      <button class="btn btn-primary me-2" (click)="continuar()">Seguir</button>
      <button class="btn btn-danger" (click)="cerrar()">Cerrar sesión</button>
      <p class="mt-2 small">La sesión se cerrará en {{segundos}} s…</p>
    </div>
  </div>`,
  styles:[`
    .modal-backdrop{position:fixed;inset:0;background:#0008;display:flex;justify-content:center;align-items:center;z-index:1050}
    .modal-box{background:#fff;padding:2rem;border-radius:8px;text-align:center;width:300px}
  `]
})
export class SessionWarningComponent implements OnDestroy {

  visible = false;
  segundos = 30;

  private sub: Subscription;
  private countInt: any;

  constructor(private sesion: SesionService) {
    this.sub = this.sesion.aviso$.subscribe(() => this.mostrar());
  }

  mostrar() {
    this.visible = true;
    this.segundos = 30;
    this.countInt = setInterval(() => {
      this.segundos--;
      if (this.segundos === 0) { clearInterval(this.countInt); }
    }, 1000);
  }

  continuar() {
    clearInterval(this.countInt);
    this.sesion.renovar();
    this.visible = false;
  }

  cerrar() {
    clearInterval(this.countInt);
    this.sesion.logout();
  }

  ngOnDestroy() { this.sub.unsubscribe(); }
}
