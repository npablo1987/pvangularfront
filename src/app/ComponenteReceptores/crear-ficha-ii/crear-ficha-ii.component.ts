import { Component, OnInit } from '@angular/core';
import { FichaService } from '../../services/ficha.service';
import { ApirestIndapService } from '../../services/apirest-indap.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidacionesInputDirective, ValidarRutDirective,   ValidarCorreoDirective,
  ValidarTelefonoDirective  } from '../../directivas/validaciones-input.directive';


@Component({
  selector: 'app-crear-ficha-ii',
  standalone: true,
  imports: [CommonModule, FormsModule, ValidacionesInputDirective, ValidarRutDirective, ValidarCorreoDirective, ValidarTelefonoDirective],
  templateUrl: './crear-ficha-ii.component.html',
  styleUrls: ['./crear-ficha-ii.component.css'],
})
export class CrearFichaIIComponent implements OnInit {
  datosEmpresa: any = {}; 
  archivos: any = {}; 
  ubicacionContacto: any = {}; 

  regiones: any[] = [];
  comunas: any[] = [];
  regionSeleccionada: number | null = null;

  errores: any = {}; 

  constructor(
    private router: Router,
    private fichaService: FichaService,
    private apiService: ApirestIndapService
  ) {}

  ngOnInit() {
  
    if (!this.fichaService.getFichaData().datosEmpresa) {
      alert('No hay una ficha en curso. Te llevaremos al paso 1.');
      this.router.navigate(['/receptores/crear-ficha']);
      return;
    }

    const fichaData = this.fichaService.getFichaData();
    this.datosEmpresa = fichaData?.datosEmpresa || {};
    this.archivos = fichaData?.archivos || {};
    this.ubicacionContacto = fichaData?.ubicacionContacto || {};

    console.log('Datos de la empresa:', this.datosEmpresa);
    console.log('Archivos subidos:', this.archivos);
    console.log('Ubicación y contacto:', this.ubicacionContacto);


    if (this.ubicacionContacto.region) {                    // ← venías del paso III
      this.regionSeleccionada = this.ubicacionContacto.region;
  
      // Trae comunas para que el select quede cargado
      this.apiService.obtenerComunasPorRegion(this.regionSeleccionada!)
      .subscribe(r => (this.comunas = r.data));
  
    }

    this.apiService.obtenerRegiones().subscribe((response) => {
      // response tiene la forma { data: [...], message: "..." }
      this.regiones = response.data; // ahora SÍ es un array
    });
  }

  getNombreRegionSeleccionada(): string {
    const region = this.regiones.find((r) => r.id === this.regionSeleccionada);
    return region ? region.nombre : '';
  }

  onRegionChange(e: Event): void {
    const idRegion = +(e.target as HTMLSelectElement).value;   // «+» => number
    this.regionSeleccionada        = idRegion;
    this.ubicacionContacto.region  = idRegion;                 // ←  guarda número
  
    this.apiService.obtenerComunasPorRegion(idRegion)
        .subscribe(r => (this.comunas = r.data));
  }

  
  validarCampos(): boolean {
    this.errores = {};
  
    /* región */
    if (!this.ubicacionContacto.region)
      this.errores.region = 'La región es obligatoria.';
  
    /* región tramitación */
    if (!this.ubicacionContacto.regiontramitacion)
      this.errores.regiontramitacion = 'La región de tramitación es obligatoria.';
  
    /* comuna */
    if (!this.ubicacionContacto.comuna)
      this.errores.comuna = 'La comuna es obligatoria.';
  
    /* dirección */
    if (!this.ubicacionContacto.direccion)
      this.errores.direccion = 'La dirección es obligatoria.';
  
    /* número (solo si no está marcado “sin número”) */
    if (!this.ubicacionContacto.sinNumero) {
      if (!this.ubicacionContacto.numero)
        this.errores.numero = 'El número es obligatorio.';
      else if (!/^\d{1,6}$/.test(this.ubicacionContacto.numero))
        this.errores.numero = 'Ingrese solo dígitos.';
    }
  
    /* correo */
    const mail = this.ubicacionContacto.correoElectronico;
    if (!mail) this.errores.correoElectronico = 'El correo electrónico es obligatorio.';
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(mail))
      this.errores.correoElectronico = 'Ingrese un correo válido.';
  
    /* teléfono */
    const fono = this.ubicacionContacto.telefono;
    if (!fono) this.errores.telefono = 'El teléfono es obligatorio.';
    else if (!/^\+?\d{9,15}$/.test(fono))
      this.errores.telefono = 'Ingrese un número de teléfono válido.';
  
    return Object.keys(this.errores).length === 0;
  }
  

  volverpasoi(){
    this.router.navigate(['/receptores/crear-ficha'])
  }

  guardarDatosYContinuar() {
    if (!this.validarCampos()) {
      console.log('Errores detectados:', this.errores);
      return; // No permite la navegación si hay errores
    }

    this.fichaService.setUbicacionContacto(this.ubicacionContacto);
    this.router.navigate(['/receptores/crear-fichaiii']);
    console.log('Datos guardados:', {
      datosEmpresa: this.datosEmpresa,
      archivos: this.archivos,
      ubicacionContacto: this.ubicacionContacto
    });
  }
}