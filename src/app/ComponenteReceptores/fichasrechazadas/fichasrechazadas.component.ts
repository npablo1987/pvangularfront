
import { CanActivate, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SesionService } from '../../services/sesion.service';
import { ApirestIndapService } from '../../services/apirest-indap.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SlicePipe } from '@angular/common'; 
import { FichaselecionadaService } from '../../services/fichaselecionada.service';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-fichasrechazadas',
  standalone: true,
  imports: [CommonModule, FormsModule, SlicePipe, RouterModule ],
  templateUrl: './fichasrechazadas.component.html',
  styleUrl: './fichasrechazadas.component.css'
})
export class FichasrechazadasComponent implements OnInit {

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
      this.apiService.obtenerFichasPorusuarioyestado(rutUsuario, "RECHAZADA")
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



}




