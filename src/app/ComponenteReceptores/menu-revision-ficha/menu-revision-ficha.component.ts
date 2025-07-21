import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu-revision-ficha',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu-revision-ficha.component.html',
  styleUrl: './menu-revision-ficha.component.css'
})
export class MenuRevisionFichaComponent {

  activeTab: string = 'Datos Empresa';

  setActive(tab: string) {
    this.activeTab = tab; // Aquí se actualiza correctamente el estado
  }
}
