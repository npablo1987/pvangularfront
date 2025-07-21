import { CanActivate, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SesionService } from '../../services/sesion.service';
import { ApirestIndapService } from '../../services/apirest-indap.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SlicePipe } from '@angular/common'; 
import { FichaselecionadaService } from '../../services/fichaselecionada.service';
import { RouterModule } from '@angular/router';

import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-fichasreceptores',
  standalone: true,
  imports: [CommonModule, FormsModule, SlicePipe, RouterModule ],
  templateUrl: './fichasreceptores.component.html',
  styleUrl: './fichasreceptores.component.css'
})
export class FichasreceptoresComponent implements OnInit {

  usuarioSesion: any = null;
  fichasUsuario: any[] = [];
  filtro: string = '';
  pagina: number = 1;
  itemsPorPagina: number = 5;

  campoOrdenamiento: string = '';
  ordenAscendente: boolean = true;

  constructor(
    private sesionService: SesionService,
    private apiService: ApirestIndapService,
    private fichaSrv: FichaselecionadaService,
    private router: Router  
  ) {}


  ngOnInit(): void {
    // 1. Obtener datos de sesión
    this.usuarioSesion = this.sesionService.getUsuario();
    console.log('Datos de sesión:', this.usuarioSesion);
  
    if (this.usuarioSesion && this.usuarioSesion.rut_enviado) {
      const rutUsuario = this.usuarioSesion.rut_enviado;
      console.log("rut consultando: "+rutUsuario);
  
      // ✅ Cambiamos aquí: consultar todas las fichas por RUT
      this.apiService.obtenerFichasPorusuarioyestado(rutUsuario, "COMPLETADA")
        .subscribe({
          next: (data) => {
            console.log('Fichas del usuario:', data);
            this.fichasUsuario = data;
          },
          error: (error) => {
            console.error('Error al obtener fichas del usuario:', error);
          }
        });
    } else {
      console.warn('No hay usuario en sesión o no tiene RUT.');
    }
  }
  // Filtro dinámico
  get personasFiltradas() {
    return this.fichasUsuario
      .filter(p => {
        const filtroLower = this.filtro.toLowerCase();
        return Object.values(p).some(value =>
          String(value).toLowerCase().includes(filtroLower)
        );
      })
      .sort((a, b) => {
        if (!this.campoOrdenamiento) return 0;
        const valorA = a[this.campoOrdenamiento];
        const valorB = b[this.campoOrdenamiento];

        if (valorA < valorB) return this.ordenAscendente ? -1 : 1;
        if (valorA > valorB) return this.ordenAscendente ? 1 : -1;
        return 0;
      });
  }

  ordenarPor(campo: string) {
    if (this.campoOrdenamiento === campo) {
      this.ordenAscendente = !this.ordenAscendente;
    } else {
      this.campoOrdenamiento = campo;
      this.ordenAscendente = true;
    }
  }

  cambiarPagina(nuevaPagina: number) {
    this.pagina = nuevaPagina;
  }

  seleccionarPersona(persona: any) {
    console.log('Ficha seleccionada:', persona);
    this.fichaSrv.setFichaSeleccionada(persona);
    this.router.navigate(['/receptores/datosempresa']);
  }

  exportarAExcel(): void {
    const tablaTemporal = document.createElement('table');
    tablaTemporal.innerHTML = `
      <thead>
        <tr>
          <th>RUT</th>
          <th>Razón Social</th>
          <th>Región</th>
          <th>Tipo de Empresa</th>
          <th>Representante Legal</th>
          <th>Contacto</th>
          <th>Fecha Certif.</th>
        </tr>
      </thead>
      <tbody>
        ${this.personasFiltradas.map(p => `
          <tr>
            <td>${p.rut}</td>
            <td>${p.nombre_razon_social}</td>
            <td>${p.id_region_tramitacion}</td>
            <td>${p.tipo_empresa}</td>
            <td>${p.otorgado_por}</td>
            <td>${p.correo}</td>
            <td>${p.fecha_otorgamiento}</td>
          </tr>`).join('')}
      </tbody>
    `;
  
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(tablaTemporal);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Receptores');
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  
    const blob: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
  
    FileSaver.saveAs(blob, 'receptores_fondos.xlsx');
  }
  


}