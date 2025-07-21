import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cargando-overlay',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="activo" class="overlay">
      <div class="spinner"></div>
    </div>
  `,
  styleUrls: ['./cargando-overlay.component.css']
})
export class CargandoOverlayComponent {
  /** Controla la visibilidad desde fuera */
  @Input() activo = false;
}
