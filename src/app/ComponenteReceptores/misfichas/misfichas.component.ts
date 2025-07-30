import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SesionService } from '../../services/sesion.service';
import { ApirestIndapService } from '../../services/apirest-indap.service';
import { CommonModule } from '@angular/common';
import { FichaselecionadaService } from '../../services/fichaselecionada.service';
import { RouterModule } from '@angular/router';

declare var $: any;


@Component({
  selector: 'app-misfichas',
  standalone: true,
  imports: [CommonModule, RouterModule ],
  templateUrl: './misfichas.component.html',
  styleUrl: './misfichas.component.css'
})
export class MisfichasComponent implements OnInit {

  usuarioSesion: any = null;
  fichasUsuario: any[] = [];
  dataTableInitialized = false;
  dataTable: any;

  constructor(
    private sesionService: SesionService,
    private apiService: ApirestIndapService,
    private fichaSrv: FichaselecionadaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usuarioSesion = this.sesionService.getUsuario();
    console.log('Datos de sesión:', this.usuarioSesion);

    if (this.usuarioSesion && this.usuarioSesion.rut_enviado) {
      const rutUsuario = this.usuarioSesion.rut_enviado;
      console.log('rut consultando: ' + rutUsuario);

      this.apiService.obtenerFichasPorusuario(rutUsuario).subscribe({
        next: (data) => {
          console.log('Fichas del usuario:', data);
          this.fichasUsuario = data;
          setTimeout(() => this.initializeDataTable(), 0);
        },
        error: (error) => {
          console.error('Error al obtener fichas del usuario:', error);
        }
      });
    } else {
      console.warn('No hay usuario en sesión o no tiene RUT.');
    }
  }

  initializeDataTable(): void {
    setTimeout(() => {
      if (this.dataTableInitialized) {
        $('#misFichas').DataTable().destroy();
      }
      this.dataTable = $('#misFichas').DataTable({
        searching: true,
        paging: true,
        responsive: true,
        pageLength: 5,
        order: [[6, 'desc']],
        language: {
          emptyTable: 'No hay información',
          info: 'Mostrando _START_ a _END_ de _TOTAL_ ',
          infoEmpty: 'Mostrando 0 a 0 de 0 entradas',
          lengthMenu: 'Mostrar _MENU_ entradas',
          search: 'Buscar:',
          zeroRecords: 'No se encontraron coincidencias',
          paginate: {
            first: 'Primero',
            last: 'Último',
            next: 'Siguiente',
            previous: 'Anterior'
          }
        }
      });
      this.dataTableInitialized = true;
    }, 0);
  }

  seleccionarPersona(persona: any) {
    console.log('Ficha seleccionada:', persona);
    this.fichaSrv.setFichaSeleccionada(persona);
    this.router.navigate(['/receptores/datosempresa']);
  }



}
