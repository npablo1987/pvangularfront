import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CabeceraNotLoggedInComponent } from '../cabecera-not-logged-in/cabecera-not-logged-in.component';
import { PiePaginaComponent } from '../pie-pagina/pie-pagina.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApirestIndapService } from '../../services/apirest-indap.service';
import { SesionService } from '../../services/sesion.service';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-inicio-sesion',
  standalone: true,
  imports: [CabeceraNotLoggedInComponent, PiePaginaComponent, CommonModule, FormsModule],
  templateUrl: './inicio-sesion.component.html',
  styleUrls: ['./inicio-sesion.component.css']
})
export class InicioSesionComponent {

  mostrarModal: boolean = false;
  rut: string = '';                // Ej "16.650.344-2"
  fechaNacimientoInput: string = ''; 
  fechaNacimiento: string = '';    // "YYYY-MM-DD"
  numeroSerie: string = '';

  constructor(
    private router: Router,
    private apiService: ApirestIndapService,
    private sesionService: SesionService,
    private loader: LoadingService    
  ) {}

  /**
   * Formatear la fecha evitando restar un día por zona horaria
   */
  formatearFecha(event: any) {
    const raw = new Date(event);
    raw.setMinutes(raw.getMinutes() + raw.getTimezoneOffset());
    const yyyy = raw.getFullYear();
    const mm = String(raw.getMonth() + 1).padStart(2, '0');
    const dd = String(raw.getDate()).padStart(2, '0');
    this.fechaNacimiento = `${yyyy}-${mm}-${dd}`;
  }

  abrirModal() {
    this.mostrarModal = true;
  }
  
  cerrarModal() {
    this.mostrarModal = false;
  }
  
  onRutChange(value: string) {
    // 1. Eliminamos todo lo que no sea dígito o K/k
    let limpio = value.replace(/[^0-9kK]/g, '').toUpperCase();

    // 2. Construi­mos el formato. 
    //    Hasta 8 dígitos de cuerpo, y 1 dígito o K de DV
    //    Ejemplo: "166503442" -> "16.650.344-2"
    if (limpio.length > 1) {
      // dv es el último caracter
      const cuerpo = limpio.slice(0, -1);
      const dv = limpio.slice(-1);
      
      // cuerpo con puntos: 1) giramos e insertamos cada 3 dígitos
      let cuerpoReves = cuerpo.split('').reverse().join('');
      let cuerpoFormateadoReves = cuerpoReves.replace(/(\d{3})(?=\d)/g, '$1.');
      let cuerpoFormateado = cuerpoFormateadoReves.split('').reverse().join('');
      
      // 3. Unimos con '-'
      limpio = cuerpoFormateado + '-' + dv;
    }
    
    // Asignamos
    this.rut = limpio;
  }

  /**
   * Valida rut con dígito verificador chileno 
   * (ya asumiendo que tiene puntos y guion).
   * Retorna la parte numérica (sin dv) o null si está malo.
   */
  private parsearRutCompleto(rutFormateado: string): string | null {
    // Debe cumplir algo como 1x.xxx.xxx-x
    const regex = /^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/;
    if (!regex.test(rutFormateado)) {
      return null;
    }
    // quitar puntos/guion
    const limpio = rutFormateado.replace(/\./g, '').replace('-', '');
    // cuerpo sin dv
    const cuerpo = limpio.slice(0, -1);
    const dv = limpio.slice(-1);
    // Validar DV
    if (!this.validarDV(cuerpo, dv.toUpperCase())) {
      return null;
    }
    return cuerpo;  // ej: "16650344"
  }

  /**
   * Lógica de dígito verificador 
   */
  private validarDV(cuerpo: string, dv: string): boolean {
    let suma = 0;
    let multiplo = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo[i], 10) * multiplo;
      multiplo = multiplo < 7 ? multiplo + 1 : 2;
    }
    const resto = 11 - (suma % 11);
    let dvEsperado;
    if (resto === 11) {
      dvEsperado = '0';
    } else if (resto === 10) {
      dvEsperado = 'K';
    } else {
      dvEsperado = String(resto);
    }
    return dv === dvEsperado;
  }

  onIngresar() {
    this.loader.show(); 

    console.log(this.rut);
    console.log(this.fechaNacimiento);
    console.log(this.numeroSerie);
    // 1. Verificar campos
    if (!this.rut || !this.fechaNacimiento || !this.numeroSerie) {
      alert('Todos los datos son obligatorios');
      return;
    }

    // 2. Validar RUT
    const rutNumerico = this.parsearRutCompleto(this.rut);
    if (!rutNumerico) {
      alert('Error: verifique el RUT (ej: 16.650.344-2)');
      return;
    }

    // 3. Consumir API
    this.apiService.iniciarSesionCedula(rutNumerico, this.fechaNacimiento, this.numeroSerie)
      .subscribe({
        next: (resp) => {
          if (resp.respuesta === 'ok') {
            this.sesionService.setUsuario(resp.datos);
            this.loader.hide();
            // OK
            this.router.navigate(['/receptores/misfichas']);
          } else {
            alert('Error al ingresar los datos. Valide sus datos por favor');
            this.loader.hide();
          }
        },
        error: (err) => {
          console.error('Error al validar cédula:', err);
          alert('Error al ingresar los datos. Valide sus datos por favor');
          this.loader.hide();
        }
      });
  }
}
