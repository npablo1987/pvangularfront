import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApirestIndapService } from '../../services/apirest-indap.service';
import { FichaService } from '../../services/ficha.service';
import { Router } from '@angular/router';
import { SesionService } from '../../services/sesion.service';
import { LoadingService } from '../../services/loading.service';
import { ValidacionesInputDirective, ValidarRutDirective,   ValidarCorreoDirective,
  ValidarTelefonoDirective  } from '../../directivas/validaciones-input.directive';
import { timeout, TimeoutError } from 'rxjs';


@Component({
  selector: 'app-crear-ficha-iii',
  standalone: true,
  imports: [CommonModule, FormsModule, ValidacionesInputDirective, ValidarRutDirective,   ValidarCorreoDirective,
    ValidarTelefonoDirective ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './crear-ficha-iii.component.html',
  styleUrls: ['./crear-ficha-iii.component.css']
})
export class CrearFichaIIIComponent implements OnInit {

  mostrarModal: boolean = false;
  ubicacionContacto: any = {};
  listaSocios: any[] = [];
  indexEditando: number | null = null;

  // Flag para evitar múltiples guardados simultáneos
  isGuardando: boolean = false;

  socio = {
    rut: '',
    nombre: '',
    sexo: '',
    fechaNacimiento: '',
    telefono: '',
    email: '',
    cargo: [] as string[],
    representanteLegal: false,
    archivoCedula: null as File | null
  };

  // Ejemplo de lista de cargos disponibles
  cargos = ['Presidente', 'Secretario', 'Tesorero', 'Socio', 'Agricultor'];
  nombreArchivo: string = '';

  constructor(
    private sesionService: SesionService,
    private router: Router,
    private fichaService: FichaService,
    private apiService: ApirestIndapService,
    private loader: LoadingService  
  ) {}

  ngOnInit() {
    if (!this.fichaService.getFichaData().datosEmpresa) {
      alert('No hay una ficha en curso. Te llevaremos al paso 1.');
      this.router.navigate(['/receptores/crear-ficha']);
      return;
    }
    this.ubicacionContacto = this.fichaService.getUbicacionContacto();
    this.listaSocios = this.fichaService.getListaSocios();
    console.log('Datos de ubicación recibidos:', this.ubicacionContacto);
    console.log('Lista de socios cargada:', this.listaSocios);
  }


  abrirModal() {
    console.log('Modal abierto');
    if (this.indexEditando === null) {
      this.resetFormulario(); // solo si es un nuevo socio
    }
    this.mostrarModal = true;
  }

  cerrarModal() {
    console.log('Modal cerrado');
    this.mostrarModal = false;
    this.indexEditando = null;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.socio.archivoCedula = file;
      this.nombreArchivo = file.name;
    }
  }

  editarSocio(index: number) {
    // Clonamos el socio para no modificar el original hasta guardar
    this.socio = { ...this.listaSocios[index] };
    this.indexEditando = index;
    this.nombreArchivo = this.socio.archivoCedula?.name || '';
    this.abrirModal();
  }

  marcarRepresentante(event: Event) {
    // limpia la bandera en todos
    this.listaSocios.forEach(s => (s.representanteLegal = false));
    // marca sólo al socio que se está editando
    this.socio.representanteLegal = (event.target as HTMLInputElement).checked;
  }

  removerSocio(index: number) {
    const socio = this.listaSocios[index];
    const ok = confirm(`¿Eliminar al socio ${socio.nombre} (${socio.rut})?`);
    if (!ok) return;
  
    this.fichaService.eliminarSocio(index);
    this.listaSocios = [...this.fichaService.getListaSocios()];
  }

  calcularFechaNacimiento(edad: number): string {
    const fechaActual = new Date();
    const anioNacimiento = fechaActual.getFullYear() - edad;
    const fechaNacimiento = new Date(
      anioNacimiento,
      fechaActual.getMonth(),
      fechaActual.getDate()
    );
    return fechaNacimiento.toLocaleDateString();
  }

  private extraerCuerpoRut(rutFormateado: string): string {
    // Quita todo excepto dígitos, luego elimina el último (DV)
    const limpio = rutFormateado.replace(/[^0-9]/g, '');
    return limpio.slice(0, -1);
  }

  abrirArchivo(archivo: File) {
    const url = URL.createObjectURL(archivo);
    const extension = archivo.name.split('.').pop()?.toLowerCase();

    if (extension === 'pdf') {
      // Abre PDF en nueva pestaña
      window.open(url, '_blank');
    } else {
      // Fuerza la descarga
      const link = document.createElement('a');
      link.href = url;
      link.download = archivo.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    // Liberar memoria
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  buscarSocio() {
    console.log('Buscando socio con rut:', this.socio.rut);
  
    if (!this.socio.rut || this.socio.rut.indexOf('-') === -1) {
      alert('Por favor ingresa un RUT válido.');
      return;
    }
  
    const rutConsulta = this.extraerCuerpoRut(this.socio.rut);
    console.log('Buscando socio con rut (cuerpo):', rutConsulta);

    this.apiService.consultarRutPisee(rutConsulta)
      .subscribe({
        next: (response) => {
          const doc = response.respuesta_xml?.documento;
          if (doc && doc.datosPersonal) {
            const dp = doc.datosPersonal;
            // Construir nombre completo
            const nombres = dp.nombre.nombres || "";
            const apellidoPaterno = dp.nombre.apellidoPaterno || "";
            const apellidoMaterno = dp.nombre.apellidoMaterno || "";
            this.socio.nombre = `${nombres.trim()} ${apellidoPaterno.trim()} ${apellidoMaterno.trim()}`;
            // Asignar sexo
            this.socio.sexo = dp.sexo === 'M' ? 'Masculino' : 'Femenino';
            // Asignar fecha de nacimiento desde la propiedad "fechaValida"
            this.socio.fechaNacimiento = dp.fechaNacimiento.fechaValida || '';
            console.log('Datos cargados del socio:', this.socio);
          } else {
            console.warn('No se encontró información de datosPersonal en la respuesta.');
          }
        },
        error: (err) => {
          console.error('Error al buscar socio:', err);
        }
      });
  }

  onSubmit() {

    if (this.socio.rut.indexOf('-') === -1 ||
        !/^[0-9]{1,2}\.[0-9]{3}\.[0-9]{3}-[0-9K]$/.test(this.socio.rut)) {
      alert('RUT inválido.');
      return;
    }

    const camposObligatorios = [
      this.socio.rut,
      this.socio.nombre,
      this.socio.sexo,
      this.socio.fechaNacimiento,
      this.socio.telefono,
      this.socio.email,
      this.socio.archivoCedula
    ];

    const camposVacios = camposObligatorios.some(c => !c || (Array.isArray(c) && c.length === 0));
    if (camposVacios) {
      alert('Por favor completa todos los campos obligatorios antes de guardar.');
      return;
    }

    if (this.indexEditando !== null) {
      this.fichaService.editarSocio(this.indexEditando, { ...this.socio });
    } else {
      const socioExistente = this.listaSocios.find(s => s.rut === this.socio.rut);
      if (socioExistente) {
        alert('El socio con este RUT ya existe.');
        return;
      }
      this.fichaService.agregarSocio({ 
        ...this.socio, 
        correo: this.socio.email  });
    }

    this.listaSocios = [...this.fichaService.getListaSocios()];
    this.resetFormulario();
    this.cerrarModal();
  }

  resetFormulario() {
    this.socio = {
      rut: '',
      nombre: '',
      sexo: '',
      fechaNacimiento: '',
      telefono: '',
      email: '',
      cargo: [],
      representanteLegal: false,
      archivoCedula: null
    };
    this.nombreArchivo = '';
    this.indexEditando = null;
  }

  

  guardarFicha() {

    /* 1️⃣  Validaciones previas (igual que antes) -------------------- */
    if (this.fichaService.getListaSocios().length === 0) {
      alert('Debes agregar al menos un socio antes de guardar la ficha.');
      return;
    }
  
    const hayRepresentante = this.fichaService
        .getListaSocios()
        .some(s => s.representanteLegal);
    if (!hayRepresentante) {
      alert('Debes seleccionar un representante legal.');
      return;
    }
  
    /* 2️⃣  Prepara loader y flags ------------------------------------ */
    if (this.isGuardando) return;
    this.isGuardando = true;
    this.loader.show();
  
    /* 3️⃣  Construye payload ----------------------------------------- */
    const fichaCompleta = this.fichaService.getFichaData();
    const usuarioSesion = this.sesionService.getUsuario();
    const payload = {
      datosEmpresa: fichaCompleta.datosEmpresa,
      ubicacionContacto: fichaCompleta.ubicacionContacto,
      listaSocios: fichaCompleta.listaSocios,
      datosSesion: usuarioSesion
    };
  
    /* 4️⃣  Dispara la petición con timeout(30000) -------------------- */
    this.apiService
        .crearPersonaJuridicaConArchivos(payload, fichaCompleta.archivos)
        .pipe( timeout(30_000) )                       // ⏱️ 30 000 ms = 30 s
        .subscribe({
          next: (res) => {
            console.log('✅ Persona Jurídica + Archivos creados:', res);
  
            this.fichaService.clearFichaData();
            this.isGuardando = false;
            this.loader.hide();
  
            alert('La ficha se ha creado correctamente. Ahora se encuentra en estado "Pendiente de Aprobación".');
            // this.router.navigate(['/otra-ruta']);
          },
          error: (err) => {
            this.isGuardando = false;
            this.loader.hide();
  
            /* Si el error es por timeout ---------------------------- */
            if (err instanceof TimeoutError) {
              alert('No fue posible conectarse con el servidor. Por favor, intenta nuevamente.');
            } else {
              console.error('❌ Error creando PJ + Subiendo archivos:', err);
              alert('Ocurrió un error al guardar la ficha. Intenta nuevamente.');
            }
          }
        });
  }
  

  /*
  guardarFicha() {
    // Evita doble guardado si el usuario hace clic rápido dos veces
    if (this.isGuardando) return;
    this.isGuardando = true;

    // 1) Obtenemos la data completa
    const fichaCompleta = this.fichaService.getFichaData();
    console.log('📌 Datos completos de la ficha:', fichaCompleta);

    // 2) Preparamos payload para /persona-juridica/create
    const payload = {
      datosEmpresa: fichaCompleta.datosEmpresa,
      ubicacionContacto: fichaCompleta.ubicacionContacto,
      listaSocios: fichaCompleta.listaSocios,
      // Solo enviamos la lista de claves (archivos) al backend
      archivos: Object.keys(fichaCompleta.archivos || {})
    };

    // 3) Enviamos la ficha
    this.apiService.enviarPersonaJuridica(payload).subscribe({
      next: (res) => {
        console.log('✅ Ficha creada con éxito:', res);
        const id_ficha = res.id_ficha;
        const rutReceptor = fichaCompleta.datosEmpresa.rutEmpresa || '';
        const archivos = fichaCompleta.archivos;

        // 4) Si hay archivos, los subimos
        if (archivos && Object.keys(archivos).length > 0) {
          this.apiService.subirArchivos(id_ficha, rutReceptor, archivos).subscribe({
            next: (resUploads) => {
              console.log('✅ Todos los archivos se subieron bien:', resUploads);
              // Limpia los archivos para evitar duplicarlos si se regresa a la pantalla
              this.fichaService.clearFichaData();
              this.isGuardando = false;
            },
            error: (errUploads) => {
              console.error('❌ Ocurrió un error subiendo archivos:', errUploads);
              this.isGuardando = false;
            }
          });
        } else {
          console.log('No hay archivos para subir');
          this.isGuardando = false;
        }
      },
      error: (err) => {
        console.error('❌ Error al crear la ficha:', err);
        this.isGuardando = false;
      }
    });
  }


   */


  volverpasoii(){
    this.router.navigate(['/receptores/crear-fichaii'])
  }

}
